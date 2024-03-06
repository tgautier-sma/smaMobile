import * as XLSX from 'xlsx';
export class FileContent {
    id!: any;
    name: string = 'nouveau fichier';
    description: string = `décrivez l'usage du fichier`;
    wb!: XLSX.WorkBook
    wsName!:string;
    file!: File;
    headers: Array<string> = [];
    rows: any;
    count!: number;

}