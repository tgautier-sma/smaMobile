import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { AsyncPipe, CommonModule } from '@angular/common';
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ProgressBarModule, AsyncPipe],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  @Input() public delayTime = 1000;
  @Input() public type = 'circle';
  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.assignDelayTime(this.delayTime);
  }
}
