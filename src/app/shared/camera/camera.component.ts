import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output,HostListener, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebcamModule, WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, DropdownModule, ToggleButtonModule, SplitButtonModule, DialogModule, InputNumberModule,
    WebcamModule
  ],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  @Input() show!: boolean;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  @HostListener('window:resize', ['$event'])
  // toggle webcam on/off
  public width!: number;
  public height!: number;
  public showWebcam = false;
  public showParams = false;
  public allowCameraSwitch = true;
  public isCameraExist = false;
  public multipleWebcamsAvailable = false;
  public mediaDevices!: MediaDeviceInfo[]
  public deviceId!: string;
  public imageQuality = 1;
  public mirrorImage="auto";
  public mirrorImageOptions=[
    {code:"auto",label:"Mise en miroir automatique"}, 
    {code:"always",label:"Met en miroir tous les flux de la caméra"},
    {code: "never",label:"Empêche la mise en miroir"}
  ];
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 1024},height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage!: WebcamImage;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  items!: MenuItem[];
  constructor() { }


  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        console.log(mediaDevices);
        this.mediaDevices = mediaDevices;
        this.deviceId=mediaDevices[0].deviceId;
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
        this.onResize();
      });
    this.items = [
      {
        label: 'Démarer la camera',
        icon: 'pi pi-refresh',
        command: () => {
          this.showWebcam = true;
        }
      },
      {
        label: 'Arreter la caméra',
        icon: 'pi pi-times',
        command: () => {
          this.showWebcam = false;
        }
      },
      { separator: true },
      {
        label: 'Installation', icon: 'pi pi-cog', command: () => {
          // this.showWebcam = false;
          this.showParams = true;
        }
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName === "show") {
        let chng = changes[propName];
        this.showWebcam=chng.currentValue;
      }
    }
  }
  onResize(event?: Event) {
    // console.log(event);
    const win = !!event ? (event.target as Window) : window;
    this.width = win.innerWidth;
    this.height = win.innerHeight;
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.getPicture.emit(webcamImage);
    this.showWebcam = true;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

}
