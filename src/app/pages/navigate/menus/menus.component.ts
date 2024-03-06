import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EventEmitterService } from '../../../services/event-emitter.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RequesterService } from '../../../services/requester.service';
import { SharedService } from '../../../services/shared.service';

import { OverlayPanel } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { PanelModule } from 'primeng/panel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule,
    SidebarModule, PanelMenuModule, TieredMenuModule, OverlayPanelModule, PanelModule,
    ChipModule, AvatarModule, AvatarGroupModule,ToolbarModule, MenuModule],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export class MenusComponent {
  appVer = environment.version;
  displayMenu = false;
  items: MenuItem[] | undefined;
  authItems: MenuItem[] | undefined;
  sidebarVisible: boolean = false;                // 
  userInfo: any = null;                          // user info from user connection
  initials:any=null;
  isUserLoggedIn: boolean = false;               // flag when user is connected
  excelSubscription!: Subscription;               //
  currentFile!: any;                      // Current file
  @Input() menus!: boolean;
  @ViewChild('cf') cf!: OverlayPanel;
  @ViewChild('acc') acc!: OverlayPanel;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private event: EventEmitterService,
    private request: RequesterService,
    private localService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.excelSubscription = this.sharedService.store.subscribe(data => {
      // console.log("Navigation :",data);
      this.currentFile = data;
    })
    this.event.dataEmitter.subscribe(data => {
      // console.log("Event receive",data);
      if (data.hasOwnProperty('logged')) {
        this.isUserLoggedIn = data.logged;
        this.getUserInfo();
        this.setAuthMenu();
      }
      if (data.hasOwnProperty('menu')) {
        this.displayMenu=data.menu
      }
    });
    this.getUserInfo();
    this.setAuthMenu();
    this.items = [
      {
        label: 'Fichier',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Nouveau',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Excel',
                icon: 'pi pi-fw pi-bookmark'
              },
              {
                label: 'CSV',
                icon: 'pi pi-fw pi-video'
              }
            ]
          },
          {
            label: 'Ouvrir...',
            icon: 'pi pi-fw pi-file-import',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/file/reader']);
            }
          },
          {
            label: 'Editer...',
            icon: 'pi pi-fw pi-file-import',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/edit']);
            }
          },
/*           {
            label: 'Supprimer',
            icon: 'pi pi-fw pi-trash'
          },
 */          {
            separator: true
          },
          {
            label: 'Sauvegarde de la configuration',
            icon: 'pi pi-fw pi-external-link',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/save']);
            }
          }
        ]
      },
      {
        label: 'Edition',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Editeur de modèle',
            icon: 'pi pi-fw pi-pencil',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/model']);
            }
          },
          {
            label: 'Modifier',
            icon: 'pi pi-fw pi-align-left',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/edit']);
            }
          },
          {
            label: 'Exporter',
            icon: 'pi pi-fw pi-align-right',
            command: () => {
              this.sidebarVisible = false;
            }
          }
        ]
      },
      {
        label: 'POC',
        icon: 'pi pi-fw pi-microsoft',
        items: [
          {
            label: 'Adresses',
            icon: 'pi pi-fw pi-map-marker',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/pocs/adresses']);
            }
          },
          {
            label: 'Envoi de mail',
            icon: 'pi pi-fw pi-send',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/pocs/mail']);
            }
          },
          {
            label: 'Signature',
            icon: 'pi pi-fw pi-envelope',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/pocs/sign']);
            }
          },
          {
            label: 'Qr Code',
            icon: 'pi pi-fw pi-qrcode',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/pocs/qrCode']);
            }
          },
        ]
      },
      {
        label: 'Outils',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Cartographie',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Création des données Draw.io',
                icon: 'pi pi-fw pi-pencil',
                command: () => {
                  this.sidebarVisible = false;
                  this.router.navigate(['/draw/create']);
                }
              },
              {
                label: 'Modifier les données Draw.io',
                icon: 'pi pi-fw pi-pencil',
                command: () => {
                  this.sidebarVisible = false;
                  this.router.navigate(['/draw/edit']);
                }
              },
              {
                label: 'Schéma Modelio',
                icon: 'pi pi-fw pi-pencil',
                command: () => {
                  this.sidebarVisible = false;
                  this.router.navigate(['/pocs/modelio']);
                }
              }
            ]
          },
          {
            label: 'Générateur',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Qr Code',
                icon: 'pi pi-fw pi-qrcode',
                command: () => {
                  this.sidebarVisible = false;
                  this.router.navigate(['/pocs/qrCode']);
                }
              },
              {
                label: 'Class pour Java Spring Boot',
                icon: 'pi pi-fw pi-pencil',
                command: () => {
                  this.sidebarVisible = false;
                  this.router.navigate(['/tools/generator']);
                }
              },
              {
                label: 'En construction',
                icon: 'pi pi-fw pi-pencil',
                command: () => {
                  this.sidebarVisible = false;
                  this.router.navigate(['']);
                }

              }
            ]
          },
          {
            label: 'Requête',
            icon: 'pi pi-fw pi-external-link',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/tools/request']);
            }
          },
          {
            label: 'Store server',
            icon: 'pi pi-fw pi-external-link',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/store']);
            }
          },
          {
            label: 'Logs serveur',
            icon: 'pi pi-fw pi-file',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/tools/logs']);
            }
          },
          {
            label: 'Historique des requêtes',
            icon: 'pi pi-fw pi-file',
            command: () => {
              this.sidebarVisible = false;
              this.router.navigate(['/tools/history']);
            }
          }
        ]
      },
      {
        label: 'Paramètres',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          this.sidebarVisible = false;
          this.router.navigate(['/params']);
        }
      },
      {
        label: 'A propos',
        icon: 'pi pi-fw pi-info',
        command: () => {
          this.sidebarVisible = false;
          this.router.navigate(['/about']);
        }
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // console.log("Changes on menus", changes);
    if (changes['menus'] ) {
      this.displayMenu = changes['menus'].currentValue;
      // console.log("Display Menu", this.displayMenu);
    }
  }
  setAuthMenu() {
    this.authItems=[];
    if (this.userInfo){
      this.authItems.push({label:this.userInfo.userName})
      this.authItems.push({label:this.userInfo.expireAt})
    }
    this.authItems.push({separator: true});
    if (this.isUserLoggedIn){
      this.authItems.push({
        label: "Déconnexion",
        visible: this.isUserLoggedIn,
        command: () => {
          this.logout();
        }});
    } else {
      this.authItems.push({
        label: "Connexion",
        visible: !this.isUserLoggedIn,
        command: () => {
          this.logIn();
        }
      });
    }
  }
  goHome() {
    this.router.navigate(['/dashboard']);
  }
  goFiles() {
    this.router.navigate(['/file/reader']);
  }

  ngOnDestroy(): void {
    if (this.excelSubscription) {
      this.excelSubscription.unsubscribe();
    }
  }
  getUserInfo() {
    const data = { "token": this.localService.getItem(environment.keyToken) };
    const url = environment.auth.server + "/api/auth/check";
    this.request.postRequest(url, data).subscribe(response => {
      // console.log(response);
      this.userInfo = response;
      this.initials=this.userInfo.userName.split(' ')[0].charAt(0).toUpperCase() + this.userInfo.userName.split(" ")[1].charAt(0).toUpperCase()
      this.isUserLoggedIn = true;
      this.setAuthMenu();
    }, error => {
      this.isUserLoggedIn = false;
      this.userInfo = null;
      this.initials=null;
      this.setAuthMenu();
    })
  }
  logout() {
    this.localService.removeItem(environment.keyToken);
    this.initials=null;
    this.isUserLoggedIn = false;
    this.userInfo = null;
    this.setAuthMenu();
  }
  logIn() {
    this.router.navigate(['/signin']);
  }
}
