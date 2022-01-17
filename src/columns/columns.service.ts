import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { AddColumnDto, ColumnDto } from './dtos/column.dto';

const path = 'columns.json';

@Injectable()
export class ColumnsService {
  private columns: ColumnDto[] = [];

  constructor() {
    const columns: string = readFileSync(path, {
      encoding: 'utf-8',
      flag: 'a+',
    });

    if (columns) {
      const obj = JSON.parse(columns) || [];
      this.columns = obj;
    }
  }

  getColumns(): ColumnDto[] {
    return this.columns;
  }

  addColumn({ title }: AddColumnDto): ColumnDto {
    const col: ColumnDto = {
      id: randomUUID(),
      title,
    };
    this.columns.push(col);
    this.writeColumns();
    return col;
  }

  updateColumn({ id, title }: ColumnDto): void {
    const columnIndex = this.columns.findIndex((c) => c.id === id);

    if (columnIndex < 0) {
      throw new NotFoundException();
    }

    this.columns[columnIndex].title = title;
    this.writeColumns();
  }

  hasColumn(id: string): boolean {
    return !!this.columns.find((col) => col.id === id);
  }

  private writeColumns(): void {
    writeFileSync(path, JSON.stringify(this.columns), { encoding: 'utf-8' });
  }
}
