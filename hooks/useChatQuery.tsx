import { useSocket } from '@/components/providers/socket-provider';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import queryString from 'query-string';

interface IProps {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}
export const useChatQuery = ({
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
}: IProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = queryString.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );
    const response = await axios.get(url);
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: 1000,
      initialPageParam: undefined,
    });

  return { data, fetchNextPage, hasNextPage, status, isFetchingNextPage };
};
