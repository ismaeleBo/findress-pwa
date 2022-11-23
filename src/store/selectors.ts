import { useTypedSelector } from './hooks';

export const useSelectUser = () => {
  const { user } = useTypedSelector((state) => state.user);
  return user;
};
