import { IJob } from "./job.interface";

export interface ISuccessResponse {
  data: IJob[];
  total: number;
}