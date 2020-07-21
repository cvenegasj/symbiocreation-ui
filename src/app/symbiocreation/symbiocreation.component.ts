import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav.service';

import { Node } from '../models/forceGraphTypes';
import { Symbiocreation, Participant } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { AuthService } from '../services/auth.service';
import { RSocketService } from '../services/rsocket.service';
import { SharedService } from '../services/shared.service';
import { concatMap, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewGroupDialogComponent } from '../new-group-dialog/new-group-dialog.component';
import { EditIdeaDialogComponent } from '../edit-idea-dialog/edit-idea-dialog.component';
import { EditGroupNameDialogComponent } from '../edit-group-name-dialog/edit-group-name-dialog.component';
import { Subscription } from 'rxjs';
import { GraphComponent } from '../graph/graph.component';

import { SymbiocreationDetailComponent } from '../symbiocreation-detail/symbiocreation-detail.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-symbiocreation',
  templateUrl: './symbiocreation.component.html',
  styleUrls: ['./symbiocreation.component.css']
})
export class SymbiocreationComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') sidenav: MatSidenav;

  @ViewChild(GraphComponent)
  private graphComponent: GraphComponent;

  //sseSubscription: Subscription;

  idGroupSelected: string = null;
  
  participant: Participant;
  groups: Node[];
  myGroup: Node;
  myAncestry: Node[];

  symbiocreation: Symbiocreation;
  roleOfLoggedIn: string = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private sidenavService: SidenavService,
    private symbioService: SymbiocreationService,
    private userService: UserService,
    public auth: AuthService,
    private rSocketService: RSocketService,
    private sharedService: SharedService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { 
    this.participant = null;
    this.groups = [];
    this.myGroup = null;
  }

  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnDestroy() {
    //this.sseSubscription.unsubscribe();
    //this.sseService.stopListening();
    this.rSocketService.disconnect();
    console.log('ngOnDestroy');
  }
  
  getData() {
    this.sharedService.nextIsLoading(true);

    const id = this.route.snapshot.paramMap.get('id');

    this.symbioService.getSymbiocreation(id)
    .pipe(
      tap(s => {
        this.symbiocreation = s;
        this.groups = this.getGroups();

        // connect to socket for updates
        this.rSocketService.connectToSymbio(this.symbiocreation.id);

        this.rSocketService.symbio$.subscribe(
          symbio => {
            if (symbio?.id === this.symbiocreation.id) { // to avoid pulling last symbio with another id
              //console.log(symbio);
              this.symbiocreation = symbio;
              this.updateReferences();
            }
          }
        );

      }),
      concatMap(s => this.auth.userProfile$),
      tap(usrProfile => {
        if (this.auth.loggedIn) {
          for (let p of this.symbiocreation.participants) {
            if (p.user.email === usrProfile.email) {
              this.participant = p;

              // group of logged-in user
              this.myGroup = this.getMyGroup();
              this.myAncestry = this.getMyAncestry();

              // role of logged-in user
              this.roleOfLoggedIn = p.role;
              // set properties of child component
              this.graphComponent.roleOfLoggedIn = this.roleOfLoggedIn;
              this.graphComponent.participant = this.participant;

              this.sharedService.nextRole(this.roleOfLoggedIn);
              
              break;
            }
          }
        }
      })
    ).subscribe(u => {
      this.sharedService.nextIsLoading(false);
      
      if (this.participant) {
        // get node w idea from DB 
        this.symbioService.getNodeById(this.symbiocreation.id, this.getMyNode().id)
          .subscribe(node => this.participant.idea = node.idea);

        // subscribe to changes made in IdeaDetailComponent
        this.sharedService.node$.subscribe(node => {
          if (node) {
            if (node.u_id === this.participant.u_id) this.participant.idea = node.idea;
          }
        });
      }
    });
  }

  /*============= Operations on local symbiocreation object =============*/

  getGroups(): Node[] {
    let groups: Node[] = [];

    function recurse(node: Node) {
      if (node.children) {
        groups.push(node);
        node.children.forEach(recurse);
      } 
    }
    // data can have many nodes at root level
    for (let n of this.symbiocreation.graph) {
      recurse(n);
    }
    return groups;
  }

  filterGroups(groups: Node[], node: Node): Node[] {
    return groups.filter(g => g.id !== node.id);
  }

  getMyGroup(): Node {
    let participant = this.participant;
    let parent = null;

    function recurse(node: Node) {
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          recurse(node.children[i]);
          if (node.children[i].u_id === participant.u_id) {
            parent = node;
            break;
          }
        }
      }
    }
    // data can have many nodes at root level
    for (let i = 0; i < this.symbiocreation.graph.length; i++) {
      recurse(this.symbiocreation.graph[i]);
    }

    return parent;
  }

  getMyAncestry(): Node[] {
    let graphWParents = this.computeParents();

    let ancestry: Node[] = [];
    let parent = null;
    let participant = this.participant;

    function recurse(node: Node) {
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          recurse(node.children[i]);
          if (node.children[i].u_id === participant.u_id) {
            parent = node;
            break;
          }
        }
      }
    }

    for (let i = 0; i < graphWParents.length; i++) {
      recurse(graphWParents[i]);
    }

    while(parent) {
      ancestry.push(parent);
      parent = parent.parent;
    }

    return ancestry;
  }

  computeParents(): Node[] {

    function recurse(node: Node) {
      if (node.children) node.children.forEach(child => {
        child.parent = node;
        recurse(child);
      });
    }

    let graphWParents = this.copy(this.symbiocreation.graph);

    // data can have many nodes at root level
    for (let i = 0; i < graphWParents.length; i++) {
      recurse(graphWParents[i]);
    }

    return graphWParents;
  }

  // deep copy of array by value
  copy(aObject) {
    if (!aObject) {
      return aObject;
    }
  
    let v;
    let bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
      v = aObject[k];
      bObject[k] = (typeof v === "object") ? this.copy(v) : v;
    }
  
    return bObject;
  }

  getMyNode(): Node {
    let participant = this.participant;
    let n: Node = null;

    function recurse(node: Node) {
      if (node.children) node.children.forEach(recurse);
      if (node.u_id === participant.u_id) n = node;
    }
    // data can have many nodes at root level
    for (let i = 0; i < this.symbiocreation.graph.length; i++) {
      recurse(this.symbiocreation.graph[i]);
    }
    return n;
  }

  getNode(nodeId: string): Node {
    let n: Node = null;

    function recurse(node: Node) {
      if (node.children) node.children.forEach(recurse);
      if (node.id === nodeId) n = node;
    }
    // data can have many nodes at root level
    for (let i = 0; i < this.symbiocreation.graph.length; i++) {
      recurse(this.symbiocreation.graph[i]);
    }
    return n;
  }

  getNodeByUserId(userId: string): Node {
    let n: Node = null;

    function recurse(node: Node) {
      if (node.children) node.children.forEach(recurse);
      if (node.u_id === userId) n = node;
    }
    // data can have many nodes at root level
    for (let i = 0; i < this.symbiocreation.graph.length; i++) {
      recurse(this.symbiocreation.graph[i]);
    }
    return n;
  }

  /*
  removeNodeFromGraph(nodeId: string) {
    function recurse(nodes: Node[]) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children) nodes[i].children = recurse(nodes[i].children);
      }
      return nodes.filter(n => n.id !== nodeId);      
    }

    this.symbiocreation.graph = recurse(this.symbiocreation.graph);
  }*/

  /*
  addNodeAsChild(child: Node, parentId: string) {
    function recurse(nodes: Node[]) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children) nodes[i].children = recurse(nodes[i].children);
        if (nodes[i].id === parentId) nodes[i].children.push(child); 
      }
      return nodes;
    }

    this.symbiocreation.graph = recurse(this.symbiocreation.graph);
  }*/

  /*
  changeNodeName(nodeId: string, newName: string) {
    function recurse(nodes: Node[]) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children) nodes[i].children = recurse(nodes[i].children);
        if (nodes[i].id === nodeId) nodes[i].name = newName; 
      }
      return nodes;
    }

    this.symbiocreation.graph = recurse(this.symbiocreation.graph);
  }*/

  /*
  changeNodeIdea(nodeId: string, newIdea: Idea) {
    function recurse(nodes: Node[]) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children) nodes[i].children = recurse(nodes[i].children);
        if (nodes[i].id === nodeId) nodes[i].idea = newIdea; 
      }
      return nodes;
    }

    this.symbiocreation.graph = recurse(this.symbiocreation.graph);
  }*/

  nodeAContainsNodeB(nodeA: Node, nodeB: Node): boolean {
    let contains = false;

    function recurse(node: Node) {
      if (node.children) node.children.forEach(recurse);
      if (node.id === nodeB.id) contains = true;
    }

    recurse(nodeA);
    return contains;
  }

  getRootContaining(node: Node): Node {
    for (let n of this.symbiocreation.graph) {
      if (this.nodeAContainsNodeB(n, node)) return n;
    }

    return null; // this should never occur
  }

  /* ========================================================================= */


  joinSymbiocreation(btnParticipate: MatButton) {
    if (!this.auth.loggedIn) {
      const id = this.route.snapshot.params.id;
      this.auth.login(`/symbiocreation/${id}`);
      
      return;
    } 

    btnParticipate.disabled = true;
    
    // add logged-in user as participant
    this.auth.userProfile$.pipe(
      concatMap(user => this.userService.getUserByEmail(user.email)),
      concatMap(u => {
        this.participant = {u_id: u.id, user: u, role: 'participant', idea: null};
        
        return this.symbioService.createParticipant(this.symbiocreation.id, this.participant);
      })
    ).subscribe(symbio => {
      this.roleOfLoggedIn = 'participant';

      this._snackBar.open('Se te agregó como participante.', 'ok', {
        duration: 2000,
      });
    });
    
  }

  // propagates changes to child graph component
  updateReferences() {
    this.symbiocreation.graph = this.symbiocreation.graph.slice();
    this.groups = this.getGroups();

    // update only role of logged-in user to keep participant.idea
    if (this.participant) {
      // look for my participant object
      for (let p of this.symbiocreation.participants) {
        if (p.user.email === this.participant.user.email) {
          this.participant.role = p.role;
          this.roleOfLoggedIn = p.role;
          
          this.graphComponent.roleOfLoggedIn = this.roleOfLoggedIn;
          this.sharedService.nextRole(this.roleOfLoggedIn);
          
          break;
        }
      }
      // update myGroup
      this.myGroup = this.getMyGroup();
      // update my ancestry
      this.myAncestry = this.getMyAncestry();
    }
  }

  openNewParentGroupDialog(containerToHide?: any) {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        const nextLevelNode: Node = {name: name, children: []};

        this.symbioService.createNextLevelGroup(this.symbiocreation.id, this.getMyNode().id, nextLevelNode)
          .subscribe(
            symbio => {
              if (containerToHide) containerToHide.hidden = true;
            }
          );
      }
    });
  }

  openNextLevelGroupDialog() {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        const nextLevelNode: Node = {name: name, children: []};

        this.symbioService.createNextLevelGroup(this.symbiocreation.id, this.getRootContaining(this.getMyNode()).id, nextLevelNode)
          .subscribe();
      }
    });
  }

  /*
  openNewGroupDialog() {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        const newNode: Node = {name: name, children: []};

        this.symbioService.createGroupNode(this.symbiocreation.id, newNode).subscribe(symbio => {
          //this.symbiocreation = symbio;
          //this.updateReferences();
        });
      }
    });
  }*/

  openMyIdeaEditDialog() {
    let toChange = this.getMyNode();

    // get node w idea from DB
    this.symbioService.getNodeById(this.symbiocreation.id, toChange.id).subscribe(
      node => {
        const dialogRef = this.dialog.open(EditIdeaDialogComponent, {
          width: '450px',
          data: {
            //name: this.participant.user.firstName && this.participant.user.lastName ? this.participant.user.firstName + ' ' + this.participant.user.lastName : this.participant.user.name,
            name: toChange.name,
            idea: node.idea
          }
        });
    
        dialogRef.afterClosed().subscribe(idea => {
          if (idea) {
            toChange.idea = idea;
            this.symbioService.updateNodeIdea(this.symbiocreation.id, toChange).subscribe(res => {
              this.participant.idea = idea;
              this._snackBar.open('Se registró la idea correctamente.', 'ok', {
                duration: 2000,
              });
            });
          }
        });
      }
    );
  }

  onMyGroupChanged() {
    let myNode = this.getMyNode();

    this.symbioService.setParentNode(this.symbiocreation.id, myNode.id, this.idGroupSelected ? this.idGroupSelected : 'none')
      .subscribe();
  }

  onParentChanged(ids) {
    let child = this.getNode(ids[0]);
    let parent = this.getNode(ids[1]);

    if (this.nodeAContainsNodeB(child, parent)) {
      this._snackBar.open('No se puede asignar. El grupo padre seleccionado es descendiente del nodo a modificar.', 'ok', {
        duration: 2000,
      });

      return;
    }

    this.symbioService.setParentNode(this.symbiocreation.id, ids[0], ids[1])
      .subscribe();
  }

  onNodeDeleted(id) {
    this.symbioService.deleteNode(this.symbiocreation.id, id).subscribe();
  }

  openChangeNodeNameDialog(id) {
    let toChange = this.getNode(id);

    const dialogRef = this.dialog.open(EditGroupNameDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        toChange.name = name;

        this.symbioService.updateNodeName(this.symbiocreation.id, toChange)
          .subscribe();
      }
    });
  }

  openEditNodeIdeaDialog(id) {
    let toChange = this.getNode(id);

    // get node w idea from DB
    this.symbioService.getNodeById(this.symbiocreation.id, toChange.id).subscribe(
      node => {
        const dialogRef = this.dialog.open(EditIdeaDialogComponent, {
          width: '550px',
          data: {
            name: toChange.name,
            idea: node.idea
          }
        });
    
        dialogRef.afterClosed().subscribe(idea => {
          if (idea) {
            toChange.idea = idea; // toChange has id and new name
            this.symbioService.updateNodeIdea(this.symbiocreation.id, toChange).subscribe(res => {
              if (node.u_id === this.participant.u_id) this.participant.idea = idea;
              
              this._snackBar.open('Se registró la idea correctamente.', 'ok', {
                duration: 2000,
              });
            });
          }
        });
      }
    );
  }

  openIdeaDetailSidenav(idNode: string) {
    this.sharedService.nextRole(this.roleOfLoggedIn);

    this.router.navigate(['idea', idNode], {relativeTo: this.route});
    this.sidenav.open();
  }

  setAsRole(userId: string, role: string) {
    this.symbioService.updateParticipantRole(this.symbiocreation.id, {u_id: userId, role: role} as Participant)
      .subscribe();
  }

  openSymbioDetailDialog() {
    const dialogRef = this.dialog.open(SymbiocreationDetailComponent, {
      width: '600px',
      data: {
        symbio: this.symbiocreation,
        isModerator: this.roleOfLoggedIn === 'moderator' ? true : false
      }
    });

    dialogRef.afterClosed().subscribe();
  }

}