import { Response } from 'express';

// Metadata type for paginated data
type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

// Generic Response Type to handle any data format
type TResponse<T> = {
  statusCode: number;
  success?: boolean;
  message?: string;
  meta?: TMeta;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  // Calculate next and previous page availability if meta exists
  const pagination = data.meta ? {
    ...data.meta,
    hasNextPage: data.meta.page < data.meta.totalPage,
    hasPrevPage: data.meta.page > 1
  } : undefined;

  // Sending the final response to the client
  res.status(data.statusCode).json({
    success: data.success ?? true, // Defaults to true if not provided
    statusCode: data.statusCode,
    message: data.message || 'Operation successful!', 
    meta: pagination,
    data: data.data,
  });
};

export default sendResponse;