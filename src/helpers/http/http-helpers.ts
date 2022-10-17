export interface HttpResponse {
  statusCode: number;
  body: any;
}

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});
