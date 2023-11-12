export type UserType = {
  email: string;
  id: number;
};

export enum StatusFriendRequest {
  PENDING = 'pending',
  ACCEPT = 'ACCEPT',
}

export enum UserSubscribeAction {
  REQUEST_FRIEND = 'REQUEST_FRIEND',
  ACCEPT_FRIEND = 'ACCEPT_FRIEND',
  DECLINE_FRIEND = 'DECLINE_FRIEND',
  DECLINE_MY_FRIEND_REQUEST = 'DECLINE_MY_FRIEND_REQUEST',
  DELETE_FRIEND = 'DELETE_FRIEND',
}

export type UserAction = {
  userId: number;
  type: UserSubscribeAction;
};
