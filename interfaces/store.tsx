import { IAction } from './action';
import { ICategory } from './category';
import { IUser } from './user';

export type IMainState = {
  error: string | null,
  isLoading: boolean,
  categories: Array<ICategory>,
  actions: Array<IAction>,
  period: string,
};

export type IAuthState = {
  user: IUser | null,
  error: string | null,
  token: string | null,
};

export type IState = {
  main: IMainState,
  auth: IAuthState,
};
