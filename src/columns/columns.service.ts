import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AddColumnDto, ColumnDto } from './dtos/column.dto';

const columns: ColumnDto[] = [];

@Injectable()
export class ColumnsService {
  getColumns(): ColumnDto[] {
    return columns;
  }

  addColumn({ title }: AddColumnDto): void {
    columns.push({
      id: randomUUID(),
      title,
    });
  }

  updateColumn({ id, title }: ColumnDto): void {
    const columnIndex = columns.findIndex((c) => c.id === id);

    if (columnIndex < 0) {
      throw new NotFoundException();
    }

    columns[columnIndex].title = title;
  }

  hasColumn(id: string): boolean {
    return !!columns.find((col) => col.id === id);
  }
}
