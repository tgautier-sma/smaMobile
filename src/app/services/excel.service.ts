import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Subject } from 'rxjs';
import { SharedService } from './shared.service';
import { FileContent } from '../shared/classes/FileContent';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(private sharedService: SharedService) { }
  initStore() {
    console.log("Init store", this.sharedService.store);
  }
  setStore(data: any) {
    this.sharedService.store.next(data);
  }
  getStore() {
    return new Promise((resolve, reject) => {
      this.sharedService.store.subscribe(data => {
        console.log("Get Store", data);
        resolve(data);
      })
    });
  }
  updateStore(data: any) {
    if (data) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    }
  }
  export(data: any, fileName: string): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }
  delete_ws(wb: XLSX.WorkBook, wsname: string): XLSX.WorkBook {
    const sidx = wb.SheetNames.indexOf(wsname);
    if (sidx !== -1) {
      // remove from workbook
      wb.SheetNames.splice(sidx, 1);
      delete wb.Sheets[wsname];
    } else {
      console.log(wsname + " worksheet not found.No delete.");
    }
    // update other structures
    if (wb.Workbook) {
      if (wb.Workbook.Views) wb.Workbook.Views.splice(sidx, 1);
      if (wb.Workbook.Names) {
        wb.Workbook.Names = [];
      }
    }
    return wb;
  }

  update(currentFile: FileContent) {
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(currentFile.rows, { header: currentFile.headers });
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Add all sheets except current sheet
    const wbNames = currentFile.wb.SheetNames;
    wbNames.forEach(wsName => {
      if (wsName !== currentFile.wsName) {
        const wsTemp = currentFile.wb.Sheets[wsName]
        XLSX.utils.book_append_sheet(wb, wsTemp, wsName);
      }
    });

    /* save to file */
    XLSX.writeFile(wb, currentFile.file.name);
  }
  normalizeColumnName(key: string): string {
    if (typeof key === 'string') {
      const f1 = key.trim().replace(/[^a-z0-9]/gi, '_');
      const f2: any = f1.replace(/(\w)\1+/g, function (str, match) {
        return (match[0] === '_') ? match[0] : str
      });
      return f2.trim();
    } else {
      return key
    }

  }
}
