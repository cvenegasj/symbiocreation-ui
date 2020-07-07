import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav.service';

import { Node } from '../models/forceGraphTypes';
import { Symbiocreation, Participant, Idea } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { AuthService } from '../services/auth.service';
import { SSEService } from '../services/sse.service';
import { concatMap, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
//import { v4 as uuidv4 } from 'uuid';
import { NewGroupDialogComponent } from '../new-group-dialog/new-group-dialog.component';
import { EditIdeaDialogComponent } from '../edit-idea-dialog/edit-idea-dialog.component';
import { EditGroupNameDialogComponent } from '../edit-group-name-dialog/edit-group-name-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-symbiocreation',
  templateUrl: './symbiocreation.component.html',
  styleUrls: ['./symbiocreation.component.css']
})
export class SymbiocreationComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') sidenav: MatSidenav;
  sseSubscription: Subscription;

  disabledGroupSelector: boolean;
  idGroupSelected: string = null;
  participant: Participant;
  groups: Node[];
  root: any;
  symbiocreation: Symbiocreation;
  roleOfLoggedIn: string = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private sidenavService: SidenavService,
    private symbioService: SymbiocreationService,
    private userService: UserService,
    public auth: AuthService,
    private sseService: SSEService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { 
    this.participant = null;
    this.groups = [];
  }

  ngOnInit(): void {
    //this.dateParser = d3.timeParse("%m/%d/%Y");
    //this.dateAccessor = d => this.dateParser(d.date);
    //this.temperatureAccessor = d => d.temperature;
    //this.humidityAccessor = d => d.humidity

    /*this.root = {
      id: '1',
      name: 'Group 1',
      idea: 'Mejorar el mundo!',
      children: [
        {
          id: "2",
          name: "Grupo 2",
          idea: "Cambiar el mundo",
          children: [
            {
              id: "45",
              name: "José Bustamante",
              idea: "Cambiar el mundo",
            },
            {
              id: "345",
              name: "Miguel Saavedra",
              idea: "Cambiar el mundo",
            },
            {
              id: "35",
              name: "Julia Mantilla",
              idea: "Cambiar el mundo",
            },
            {
              id: "65",
              name: "Benito Juárez",
              idea: "Cambiar el mundo",
            },
            {
              id: "2",
              name: "Lefo",
              idea: "Cambiar el mundo",
            }
          ]
        },
        {
          id: "3",
          name: "Grupo 3",
          idea: "Resolver el cambio climático",
          children: [
            {
              id: "76",
              name: "Grupo 54",
              idea: "Cambiar el mundo",
              children: [
                {
                  id: "67",
                  name: "Luis",
                  idea: "Cambiar el mundo",
                },
                {
                  id: "321",
                  name: "Milagros",
                  idea: "Cambiar el mundo",
                },
                {
                  id: "4355",
                  name: "Consuelo",
                  idea: "Cambiar el mundo",
                },
                {
                  id: "7623",
                  name: "Aiden",
                  idea: "Cambiar el mundo",
                }
              ]
            },
            {
              id: "675",
              name: "Grupo 45",
              idea: "Cambiar el mundo",
              children: [
                {
                  id: "76223",
                  name: "Louise",
                  idea: "Cambiar el mundo",
                },
                {
                  id: "733",
                  name: "Joan",
                  idea: "Cambiar el mundo",
                }
              ]
            },
            {
              id: "45",
              name: "Grupo 33",
              idea: "Cambiar el mundo",
              children: [
                {
                  id: "713",
                  name: "Matthew",
                  idea: "Cambiar el mundo",
                }, 
                {
                  id: "533",
                  name: "Sergio",
                  idea: "Cambiar el mundo",
                }, 
                {
                  id: "633",
                  name: "Karla",
                  idea: "Cambiar el mundo",
                }
              ]
            }
          ]
        },
        {
          id: "4",
          name: "Grupo 4",
          idea: "Mi idea",
          children: [
            {
              id: "657",
              name: "Carlos",
              idea: "Cambiar el mundo",
            },
            {
              id: "643",
              name: "Joan",
              idea: "Cambiar el mundo",
            },
            {
              id: "097",
              name: "Olivia",
              idea: "Cambiar el mundo",
            }
          ]
        }
      ]
    };*/

    this.getData();
    
    this.sseSubscription = this.sseService.symbio$.subscribe(
      symbio => {
        console.log(symbio);
        if (symbio) {
          this.symbiocreation = symbio;
          this.updateReferences();
        }
      }
    );
  }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnDestroy(): void {
    this.sseSubscription.unsubscribe();
  }
  
  getData() {
    const id = this.route.snapshot.paramMap.get('id');
    this.symbioService.getSymbiocreation(id).pipe(
      tap(s => {
        this.symbiocreation = s;
        this.sseService.receiveUpdatesFromSymbio(this.symbiocreation.id);
      }),
      concatMap(s => this.auth.userProfile$),
      tap(u => {
        if (this.auth.loggedIn) {
          for (let p of this.symbiocreation.participants) {
            if (p.user.email === u.email) {
              this.participant = p;
              this.roleOfLoggedIn = p.role;
              const parentNode = this.getMyGroup();
              this.disabledGroupSelector =  parentNode ? true : false;
              this.idGroupSelected = parentNode?.id;
              
              this.groups = this.getGroups();
              break;
            }
          }
        }
      })
    ).subscribe(u => {
      if (this.participant) {
        // get node w idea from DB 
        this.symbioService.getNodeById(this.symbiocreation.id, this.getMyNode().id).subscribe(node => this.participant.idea = node.idea);
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
      if (node.children) node.children.forEach(recurse);
        for (let i = 0; i < node.children?.length; i++) {
          recurse(node.children[i]);
          if (node.children[i].u_id === participant.u_id) {
            parent = node;
            break;
          }
        }
      
    }
    // data can have many nodes at root level
    for (let i = 0; i < this.symbiocreation.graph.length; i++) {
      recurse(this.symbiocreation.graph[i]);
    }

    return parent;
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

  removeNodeFromGraph(nodeId: string) {
    function recurse(nodes: Node[]) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children) nodes[i].children = recurse(nodes[i].children);
      }
      return nodes.filter(n => n.id !== nodeId);      
    }

    this.symbiocreation.graph = recurse(this.symbiocreation.graph);
  }

  addNodeAsChild(child: Node, parentId: string) {
    function recurse(nodes: Node[]) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children) nodes[i].children = recurse(nodes[i].children);
        if (nodes[i].id === parentId) nodes[i].children.push(child); 
      }
      return nodes;
    }

    this.symbiocreation.graph = recurse(this.symbiocreation.graph);
  }

  changeNodeName(nodeId: string, newName: string) {
    function recurse(nodes: Node[]) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children) nodes[i].children = recurse(nodes[i].children);
        if (nodes[i].id === nodeId) nodes[i].name = newName; 
      }
      return nodes;
    }

    this.symbiocreation.graph = recurse(this.symbiocreation.graph);
  }

  changeNodeIdea(nodeId: string, newIdea: Idea) {
    function recurse(nodes: Node[]) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children) nodes[i].children = recurse(nodes[i].children);
        if (nodes[i].id === nodeId) nodes[i].idea = newIdea; 
      }
      return nodes;
    }

    this.symbiocreation.graph = recurse(this.symbiocreation.graph);
  }
  /* ========================================================================= */

  joinSymbiocreation() {
    if (!this.auth.loggedIn) {
      const id = this.route.snapshot.params.id;
      this.auth.login(`/symbiocreation/${id}`);
    } else {
      // add logged-in user as participant
      this.auth.userProfile$.pipe(
        concatMap(user => this.userService.getUserByEmail(user.email)),
        concatMap(u => {
          this.participant = {u_id: u.id, user: u, role: 'participant', idea: null};
          //let pNode: Node = {id: uuidv4(), u_id: u.id, name: u.firstName};

          //this.symbiocreation.participants.push(this.participant);
          //this.symbiocreation.graph.push({id: uuidv4(), u_id: u.id, name: u.firstName} as Node);
          
          //this.symbiocreation.lastModified = new Date();
          
          return this.symbioService.createParticipant(this.symbiocreation.id, this.participant);
        })
      ).subscribe(symbio => {
        //console.log('updated from server: ', res);
        this.symbiocreation = symbio;
        this.updateReferences(); 
        // for view
        this.roleOfLoggedIn = 'participant';
        this.disabledGroupSelector = false;

        this._snackBar.open('Se te agregó como participante.', 'ok', {
          duration: 2000,
        });
      });
    }
  }

  // will propagate changes to child component graph
  updateReferences() {
    this.symbiocreation.graph = this.symbiocreation.graph.slice();
    this.groups = this.getGroups();
  }

  openNewGroupDialog() {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        //console.log('ok pressed');
        //const newNode: Node = {id: uuidv4(), name: result, children: []};
        const newNode: Node = {name: name, children: []};
        //this.symbiocreation.graph.push(newNode);

        //this.symbiocreation.lastModified = new Date();

        this.symbioService.createGroupNode(this.symbiocreation.id, newNode).subscribe(symbio => {
          this.symbiocreation = symbio;
          this.updateReferences();
        });
      }
    });
  }

  openMyIdeaEditDialog() {
    let toChange = this.getMyNode();
    // get node w idea from DB
    this.symbioService.getNodeById(this.symbiocreation.id, toChange.id).subscribe(
      node => {
        const dialogRef = this.dialog.open(EditIdeaDialogComponent, {
          width: '450px',
          data: {
            name: this.participant.user.firstName + ' ' + this.participant.user.lastName,
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
    // update graph
    let myNode = this.getMyNode();
    //console.log('my node: ', myNode);
    //console.log('my current parent: ', this.getMyGroup());

    //console.log('old symbio graph: ', this.symbiocreation.graph);
    //this.removeNodeFromGraph(myNode.id);
    //this.addNodeAsChild(myNode, this.idGroupSelected);

    //this.symbiocreation.lastModified = new Date();

    this.symbioService.setParentNode(this.symbiocreation.id, myNode.id, this.idGroupSelected)
      .subscribe(symbio => {
        //console.log('my new parent: ', this.getMyGroup());
        //console.log('new symbio graph: ', this.symbiocreation.graph);
        this.symbiocreation = symbio;
        this.updateReferences();
        this.disabledGroupSelector = true;
      });
  }

  onParentChanged(ids) {
    let child = this.getNode(ids[0]);
    //this.removeNodeFromGraph(ids[0]);
    //this.addNodeAsChild(child, ids[1]);

    //this.symbiocreation.lastModified = new Date();

    this.symbioService.setParentNode(this.symbiocreation.id, ids[0], ids[1])
      .subscribe(symbio => {
        this.symbiocreation = symbio;
        this.updateReferences();
        // if edited node is me, update my group selector
        if (child.u_id === this.participant.u_id) this.idGroupSelected = ids[1];
      });
  }

  onNodeDeleted(id) {
    //let toDelete = this.getNode(id);
    //this.removeNodeFromGraph(toDelete.id);
    //this.symbiocreation.graph.push(...toDelete.children);

    //this.symbiocreation.lastModified = new Date();

    this.symbioService.deleteNode(this.symbiocreation.id, id)
      .subscribe(symbio => {
        this.symbiocreation = symbio;
        this.updateReferences();
      });
  }

  onNodeChangedName(id) {
    let toChange = this.getNode(id);

    const dialogRef = this.dialog.open(EditGroupNameDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        //this.changeNodeName(id, result);
        toChange.name = name;

        //this.symbiocreation.lastModified = new Date();

        this.symbioService.updateNodeName(this.symbiocreation.id, toChange)
          .subscribe(symbio => {
            //this.symbiocreation = symbio;
            //this.updateReferences();
          });
      }
    });
  }

  onNodeChangedIdea(id) {
    let toChange = this.getNode(id);
    // get node w idea from DB
    this.symbioService.getNodeById(this.symbiocreation.id, toChange.id).subscribe(
      node => {
        const dialogRef = this.dialog.open(EditIdeaDialogComponent, {
          width: '450px',
          data: {
            name: toChange.name,
            idea: node.idea
          }
        });
    
        dialogRef.afterClosed().subscribe(idea => {
          if (idea) {
            //this.changeNodeIdea(id, result);
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
    this.router.navigate(['idea', idNode], {relativeTo: this.route});
    this.sidenav.open();
  }

}