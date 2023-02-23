import { Args, Query, Resolver } from '@nestjs/graphql';
import { handingQueueRequest } from 'src/libs/handing-queue-request';
import { AuthUser } from '../auth/decorator/auth-user.decorator';
import { PageDetail } from './models/page-detail.model';
import { Page, Pages } from './models/pages.model';
import { PagesService } from './pages.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SkipThrottle } from '@nestjs/throttler';

// const cachedPages: Record<string, any> = {};
// const queuesByClientName: Record<string, any> = {};
@Resolver()
export class PagesResolver {
  constructor(
    private readonly pagesService: PagesService,
    @InjectQueue('pages') private pageQueue: Queue,
  ) {}

  // @SkipThrottle()
  // @Query(() => Pages)
  // async pages(@AuthUser() clientName: string) {
  //   const handle = async (handingCurrentRequest: () => any) => {
  //     return new Promise(async (resolve, reject) => {
  //       const key = `list-pages-${clientName}`;
  //       const listPages = cachedPages[key];
  //       if (!listPages) {
  //         console.log('run get data');
  //         if (!queuesByClientName[clientName]) {
  //           queuesByClientName[clientName] = {
  //             requests: [],
  //             iscleaning: false,
  //           };
  //         }
  //         const requestsInProgress = queuesByClientName[clientName].requests;
  //         console.log('requestsInProgress', requestsInProgress);
  //         if (requestsInProgress.length < 3) {
  //           const requestId = handingCurrentRequest();
  //           console.log('handingCurrentRequest', requestId);
  //           requestsInProgress.push({
  //             requestId,
  //           });
  //           const pages = await this.pagesService.listPages(clientName);
  //           cachedPages[key] = pages;
  //           return resolve({ status: 'success', data: pages });
  //         } else {
  //           if (!queuesByClientName[clientName].iscleaning) {
  //             setTimeout(() => {
  //               queuesByClientName[clientName] = {
  //                 requests: [],
  //                 iscleaning: false,
  //               };
  //               console.log('is cleared');
  //               resolve({ status: 'cleanup' });
  //             }, 2000);
  //           }
  //           queuesByClientName[clientName].iscleaning = true;
  //         }
  //       } else {
  //         return resolve({ status: 'success', data: listPages });
  //       }
  //     });
  //   };
  //   const listPages = handingQueueRequest(handle);

  //   return listPages;
  // }

  @SkipThrottle()
  @Query(() => Pages, { name: 'pages' })
  async pages(@AuthUser() clientName: string) {
    const data = await this.pageQueue.add(
      'get-list-pages',
      { clientName },
      { removeOnComplete: true },
    );
    const result = await data.finished();

    return result;
  }

  @Query(() => PageDetail)
  async pageById(@Args('id') id: string, @AuthUser() clientName: string) {
    return this.pagesService.pageById(id, clientName);
  }
}
