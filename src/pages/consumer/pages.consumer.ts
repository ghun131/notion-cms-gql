import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PagesService } from '../pages.service';

@Processor('pages')
export class PagesConsumer {
  constructor(private readonly pagesService: PagesService) {}
  @Process('get-list-pages')
  async getListPages(job: Job<any>) {
    const pages = await this.pagesService.listPages(job.data.clientName);

    return pages;
  }
}
