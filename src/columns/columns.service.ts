import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AddColumnDto, ColumnDto } from './dtos/column.dto';

@Injectable()
export class ColumnsService {
  private columns: ColumnDto[] = [];

  constructor() {}

  getColumns(): ColumnDto[] {
    return this.columns;
  }

  addColumn({ title }: AddColumnDto): ColumnDto {
    const col: ColumnDto = {
      id: randomUUID(),
      title,
    };
    this.columns.push(col);
    return col;
  }

  updateColumn({ id, title }: ColumnDto): void {
    const columnIndex = this.columns.findIndex((c) => c.id === id);

    if (columnIndex < 0) {
      throw new NotFoundException();
    }

    this.columns[columnIndex].title = title;
  }

  hasColumn(id: string): boolean {
    return !!this.columns.find((col) => col.id === id);
  }

  deleteColumn(id: string): void {
    this.columns = this.columns.filter((col) => col.id !== id);
  }
}
