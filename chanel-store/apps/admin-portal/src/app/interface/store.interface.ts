import { IStore, IBusinessHourDto } from '@chanel-store/store';

export interface ICreateStore extends IStore {
  businessHours: IBusinessHourDto[];
}
