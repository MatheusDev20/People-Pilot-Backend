export interface HttpResponse {
  statusCode: number;
  body: any;
  message?: string;
}

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  message: 'Sucessfully Created!',
  body: data,
});

export const updated = (data: any): HttpResponse => ({
  statusCode: 200,
  message: 'Sucessfully Updated!',
  body: data,
});
