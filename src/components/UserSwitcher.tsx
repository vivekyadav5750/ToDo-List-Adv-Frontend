import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { User } from '../types';
import { setCurrentUser } from '../redux/reducers/userSlice';
import Image from 'next/image';
import { FaAngleDown } from 'react-icons/fa';
import { resetTags } from '@/redux/reducers/todoSlice';

function UserSwitcher({ currentUser }: { currentUser: User }) {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-light-gray border border-medium-gray px-4 py-2 rounded hover:bg-medium-gray transition"
      >
        <span>{currentUser.name}</span>
        <FaAngleDown />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-48 bg-white border border-medium-gray rounded shadow-custom mt-2 z-10">
          {users.map((user: User) => (
            <div
              key={user._id}
              className="flex items-center gap-2 p-2 hover:bg-light-gray cursor-pointer"
              onClick={() => {
                dispatch(setCurrentUser(user));
                dispatch(resetTags())
                setIsOpen(false);
              }}
            >

              <Image
                src="/placeholder-avatar.png"
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserSwitcher;