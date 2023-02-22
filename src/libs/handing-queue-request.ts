let countRequest = 0;
const orderRequest = [];
type RequestId = number;
type HandingCurrentRequest = () => RequestId;

export const handingQueueRequest = async (
  callback: (fn: HandingCurrentRequest) => Promise<any>,
) => {
  countRequest += 1;
  const requestId = countRequest;
  console.log('incoming requestId', requestId);
  orderRequest.push({ id: requestId });

  const data = await new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const firstRequest = orderRequest[0];
      // console.log('firstRequest', firstRequest, requestId);
      if (firstRequest && !firstRequest.inprogress) {
        console.log('inprogress request', firstRequest);
        callback(() => {
          firstRequest.inprogress = true;
          return firstRequest.id;
        }).then((result) => {
          if (result?.status === 'success') {
            clearInterval(interval);
            const requestId = orderRequest.shift();
            console.log('clear id', requestId);
            resolve(result.data);
          } else {
            console.log('result', result);
          }
        });
      }
    }, 500);
  });
  return data;
};
