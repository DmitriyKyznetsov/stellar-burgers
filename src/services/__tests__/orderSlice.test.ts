import orderReducer, {
  fetchOrderByNumber,
  clearOrder
} from '../slices/orderSlice';

jest.mock('../../utils/burger-api');
import { getOrderByNumberApi } from '../../utils/burger-api';

describe('orderSlice', () => {
  const mockOrderResponse = {
    success: true,
    orders: [
      {
        _id: '67929ec1133acd001be4c555',
        ingredients: ['643d69a5c3f7b9001cfa093d'],
        owner: '678e872d133acd001be4b93b',
        status: 'done',
        name: 'Флюоресцентный бургер',
        createdAt: '2025-01-23T19:20:08.295Z',
        updatedAt: '2025-01-23T19:20:08.881Z',
        number: 66636
      }
    ]
  };

  const initialState = {
    currentOrder: null,
    loading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Редьюсеры', () => {
    it('clearOrder сбрасывает состояние currentOrder и error', () => {
      const stateWithOrder = {
        currentOrder: mockOrderResponse.orders[0],
        loading: false,
        error: null
      };
      const newState = orderReducer(stateWithOrder, clearOrder());
      expect(newState.currentOrder).toBeNull();
      expect(newState.error).toBeNull();
    });
  });

  describe('fetchOrderByNumber', () => {
    it('fetchOrderByNumber.pending', () => {
      const newState = orderReducer(
        initialState,
        fetchOrderByNumber.pending('', mockOrderResponse.orders[0].number)
      );
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fetchOrderByNumber.fulfilled', () => {
      const newState = orderReducer(
        initialState,
        fetchOrderByNumber.fulfilled(
          mockOrderResponse,
          '',
          mockOrderResponse.orders[0].number
        )
      );

      (getOrderByNumberApi as jest.Mock).mockResolvedValueOnce(
        mockOrderResponse
      );

      expect(newState.loading).toBe(false);
      expect(newState.currentOrder).toEqual(mockOrderResponse.orders[0]);
    });

    it('fetchOrderByNumber.rejected', () => {
      const errorMessage = 'Ошибка при загрузке заказа';

      (getOrderByNumberApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const newState = orderReducer(
        initialState,
        fetchOrderByNumber.rejected(
          new Error(errorMessage),
          '',
          mockOrderResponse.orders[0].number
        )
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
