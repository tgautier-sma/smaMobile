import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { environment } from '../environments/environment';
import { EventEmitterService } from './services/event-emitter.service';
import { LocalStorageService } from './services/local-storage.service';
import { RequesterService } from './services/requester.service';
import { SharedService } from './services/shared.service';

import { LoaderComponent } from './shared/loader/loader.component';

import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { PanelModule } from 'primeng/panel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,
    SidebarModule, PanelMenuModule, TieredMenuModule, OverlayPanelModule, PanelModule,
    ChipModule, AvatarModule, AvatarModule, ToolbarModule, MenuModule,
    LoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent implements OnInit {
  title = "sma-mobile";
  appVer = environment.version;
  sidebarVisible: boolean = false;
  networkStatus!: any;
  userInfo: any = null;                          // user info from user connection
  initials: any = null;
  items: MenuItem[] | undefined;
  authItems: MenuItem[] | undefined;
  isUserLoggedIn: boolean = false;               // flag when user is connected

  constructor(
    private config: PrimeNGConfig,
    private ngZone: NgZone,
    private router: Router,
    private sharedService: SharedService,
    private event: EventEmitterService,
    private request: RequesterService,
    private localService: LocalStorageService
  ) { }

  async ngOnInit() {
    /* Network.addListener("networkStatusChange", (status:any) => {
      this.ngZone.run(() => {
        // This code will run in Angular's execution context
        this.networkStatus = status.connected ? "Online" : "Offline";
      });
    }); */
    this.event.dataEmitter.subscribe(data => {
      // console.log("Event receive",data);
      if (data.hasOwnProperty('logged')) {
        this.isUserLoggedIn = data.logged;
        this.getUserInfo();
        this.setAuthMenu();
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
  setAuthMenu() {
    this.authItems = [];
    if (this.userInfo) {
      this.authItems.push({ label: this.userInfo.userName })
      this.authItems.push({ label: this.userInfo.expireAt })
    }
    this.authItems.push({ separator: true });
    if (this.isUserLoggedIn) {
      this.authItems.push({
        label: "Déconnexion",
        visible: this.isUserLoggedIn,
        command: () => {
          this.logout();
        }
      });
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
    this.router.navigate(['/home']);
  }
  goPage(idx: any) {
    this.router.navigate(['/page' + idx])
  }
  getUserInfo() {
    const data = { "token": this.localService.getItem(environment.keyToken) };
    const url = environment.auth.server + "/api/auth/check";
    this.request.postRequest(url, data).subscribe(response => {
      // console.log(response);
      this.userInfo = response;
      this.initials = this.userInfo.userName.split(' ')[0].charAt(0).toUpperCase() + this.userInfo.userName.split(" ")[1].charAt(0).toUpperCase()
      this.isUserLoggedIn = true;
      this.setAuthMenu();
    }, error => {
      this.isUserLoggedIn = false;
      this.userInfo = null;
      this.initials = null;
      this.setAuthMenu();
    })
  }
  logout() {
    this.localService.removeItem(environment.keyToken);
    this.initials = null;
    this.isUserLoggedIn = false;
    this.userInfo = null;
    this.setAuthMenu();
  }
  logIn() {
    this.router.navigate(['/signin']);
  }
}