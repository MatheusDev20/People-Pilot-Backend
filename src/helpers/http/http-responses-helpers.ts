export type HttpResponse<T> = {
  statusCode: number;
  body: T;
  message?: string;
};

export const ok = <T = any>(data: any): HttpResponse<T> => ({
  statusCode: 200,
  body: data,
});

export const authenticated = <T = any>(data: any): HttpResponse<T> => ({
  statusCode: 200,
  body: data,
});

export const created = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 201,
  message: 'Sucessfully Created!',
  body: data,
});

export const updated = <T = any>(data: any): HttpResponse<T> => ({
  statusCode: 200,
  message: 'Sucessfully Updated!',
  body: data,
});

export const deleted = <T = any>(data: any): HttpResponse<T> => ({
  statusCode: 200,
  message: 'Successfully Deleted',
  body: data,
});
