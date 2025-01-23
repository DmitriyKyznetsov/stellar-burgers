import feedReducer, { fetchFeed } from '../slices/feedSlice';

jest.mock('../../utils/burger-api');
import { getFeedsApi } from '../../utils/burger-api';

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: true,
    error: null
  };

  const mockFeedResponse = {
    success: true,
    orders: [
      {
        _id: '67929668133acd001be4c53d',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093d'
        ],
        status: 'done',
        name: 'Флюоресцентный люминесцентный бургер',
        createdAt: '2025-01-23T19:20:08.295Z',
        updatedAt: '2025-01-23T19:20:08.881Z',
        number: 66635
      }
    ],
    total: 66261,
    totalToday: 94
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchFeed', () => {
    it('fetchFeed.pending', () => {
      const newState = feedReducer(
        initialState,
        fetchFeed.pending('', undefined)
      );
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fetchFeed.fulfilled', () => {
      const newState = feedReducer(
        initialState,
        fetchFeed.fulfilled(mockFeedResponse, '', undefined)
      );

      // Мокаем успешный ответ для getFeedsApi
      (getFeedsApi as jest.Mock).mockResolvedValueOnce(mockFeedResponse);

      expect(newState.loading).toBe(false);
      expect(newState.orders).toEqual(mockFeedResponse.orders);
      expect(newState.total).toBe(mockFeedResponse.total);
      expect(newState.totalToday).toBe(mockFeedResponse.totalToday);
    });

    it('fetchFeed.rejected', () => {
      const errorMessage = 'Ошибка при загрузке заказов';

      // Мокаем ошибку при вызове getFeedsApi
      (getFeedsApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const newState = feedReducer(
        initialState,
        fetchFeed.rejected(new Error(errorMessage), '', undefined)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
