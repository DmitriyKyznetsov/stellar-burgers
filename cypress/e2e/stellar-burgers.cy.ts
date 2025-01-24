const selectors = {
  modal: '[data-cy="modal"]',
  closeModalButton: '[data-cy="close-modal-button"]',
  modalOverlay: '[data-cy="modal-overlay"]',
  ingredientsList: {
    list: '[data-cy^="ingredients-list-"]',
    buns: '[data-cy="ingredients-list-булки"] li',
    fillings: '[data-cy="ingredients-list-начинки"] li',
    sauces: '[data-cy="ingredients-list-соусы"] li'
  },
  ingredient: '[data-cy^="ingredient-"]',
  constructor: {
    topBun: '[data-cy="constructor-top-bun-',
    bottomBun: '[data-cy="constructor-bottom-bun-',
    ingredient: '[data-cy^="constructor-ingredient-',
    ingredients: '[data-cy="constructor-ingredients"]',
    emptyTopBun: '[data-cy="constructor-empty-top-bun"]',
    emptyIngredients: '[data-cy="constructor-empty-ingredients"]',
    emptyBottomBun: '[data-cy="constructor-empty-bottom-bun"]',
    confirmButton: '[data-cy="constructor-confirm-button"]'
  },
  menu: {
    profile: '[data-cy="menu-profile"]',
    username: '[data-cy="menu-profile-username"]'
  },
  auth: {
    loginInput: '[data-cy="input-login"]',
    passwordInput: '[data-cy="password-login"]',
    loginButton: '[data-cy="button-login"]'
  },
  orderConfirm: (orderNumber: number) =>
    `[data-cy="order-confirm-${orderNumber}"]`
};

describe('Проверка работы конструктора бургеров:', () => {
  beforeEach(() => {
    // Загружаем приложение
    cy.visit('/');

    // Перехватываем запрос на получение ингредиентов и подставляем моковые данные
    cy.intercept('GET', '/api/ingredients', (req) => {
      req.reply({ fixture: 'getIngredientsApiResponse.json' });
    }).as('getIngredientsApi');

    // Дожидаемся завершения перехвата запроса
    cy.wait('@getIngredientsApi');
  });

  it('Перехват запроса и отображение 6-ти ингредиентов', () => {
    // Проверяем, что на странице есть 6 ингредиентов

    // Подсчитываем количество ингредиентов в каждой категории
    cy.get(selectors.ingredientsList.buns).should('have.length', 2);
    cy.get(selectors.ingredientsList.fillings).should('have.length', 2);
    cy.get(selectors.ingredientsList.sauces).should('have.length', 2);

    // Суммарное количество ингредиентов на странице 6
    cy.get(selectors.ingredient).should('have.length', 6);
  });

  it('Добавление ингредиентов в конструктор и проверка счётчика', () => {
    // Пробежка по категориям на сайте
    cy.get(selectors.ingredientsList.list).each(($category) => {
      const categoryDataCy = $category.attr('data-cy');

      if (categoryDataCy) {
        // Получаем имена категорий ингредиентов
        const categoryName = categoryDataCy.split('-')[2];

        // Пробежка по ингредиентам внутри категорий
        cy.wrap($category)
          .find(selectors.ingredient)
          .each(($ingredient, index) => {
            // Получаем ID ингредиента
            const ingredientDataCy = $ingredient.attr('data-cy');

            if (ingredientDataCy) {
              const ingredientId = ingredientDataCy.split('-')[1];

              // Нажимаем кнопку "Добавить"
              cy.wrap($ingredient).find('button').click();

              // Проверяем, что счётчик существует
              cy.wrap($ingredient).find('.counter').should('exist');

              // В зависимости от категории проверяем, что счётчик равен 2 (булка) или 1 (остальное)
              if (categoryName === 'булки') {
                // Проверка счётчика булки
                // Если это не первая булка, проверяем, что у предыдущей булки счётчик исчез
                if (index > 0) {
                  cy.wrap($category)
                    .find(selectors.ingredient)
                    .eq(index - 1) // Предыдущий элемент
                    .find('.counter')
                    .should('not.exist');
                }
                // Счётчик равен 2
                cy.wrap($ingredient)
                  .find('.counter__num')
                  .should('have.text', '2');

                // Проверка, что булка добавилась на top и bottom позиции конструктора
                cy.get(
                  `${selectors.constructor.topBun}${ingredientId}"]`
                ).should('exist');
                cy.get(
                  `${selectors.constructor.bottomBun}${ingredientId}"]`
                ).should('exist');
              } else {
                // Проверка счётчика ингредиента
                // Счётчик равен 1
                cy.wrap($ingredient)
                  .find('.counter__num')
                  .should('have.text', '1');

                // Проверяем, что ингредиент добавился в конструктор
                cy.get(selectors.constructor.ingredients)
                  .find(`${selectors.constructor.ingredient}${ingredientId}"]`)
                  .should('exist');
              }
            }
          });
      }
    });
  });
});

describe('Проверка работы модальных окон:', () => {
  beforeEach(() => {
    // Загружаем приложение
    cy.visit('/');

    // Перехватываем запрос на получение ингредиентов и подставляем моковые данные
    cy.intercept('GET', '/api/ingredients', (req) => {
      req.reply({ fixture: 'getIngredientsApiResponse.json' });
    }).as('getIngredientsApi');

    // Ожидание перехвата запроса
    cy.wait('@getIngredientsApi');

    // Убедиться, что модальное окно не существует
    cy.get(selectors.modal).should('not.exist');

    // Найти первый попавшийся ингредиент и нажать по нему
    cy.get(selectors.ingredient).first().click();

    // Проверить, что модальное окно существует
    cy.get(selectors.modal).should('exist');
  });

  it('Закрытие модального окна через кнопку', () => {
    cy.get(selectors.closeModalButton).click();
  });

  it('Закрытие модального окна через Escape', () => {
    cy.get('body').type('{esc}');
  });

  it('Закрытие модального окна через оверлей', () => {
    cy.get(selectors.modalOverlay).click({ force: true });
  });

  afterEach(() => {
    // Убедиться, что модальное окно не существует
    cy.get(selectors.modal).should('not.exist');
  });
});

describe('Проверка авторизации и получения данных пользователя:', () => {
  beforeEach(() => {
    // Загружаем приложение
    cy.visit('/');

    // Перехватываем запрос на получение ингредиентов и подставляем моковые данные
    cy.intercept('GET', '/api/ingredients', (req) => {
      req.reply({ fixture: '' });
    }).as('getIngredientsApi');

    // Дожидаемся завершения перехвата запроса
    cy.wait('@getIngredientsApi');
  });

  it('Проверка авторизации пользователя', () => {
    // Перехватываем запрос на авторизацию и подставляем моковые данные из файла
    cy.intercept('POST', '/api/auth/login', {
      fixture: 'loginUserApiResponse.json'
    }).as('loginApi');

    // Открываем меню профиля
    cy.get(selectors.menu.profile).click();

    // Вводим логин и пароль
    cy.get(selectors.auth.loginInput).type('test@mail.ru');
    cy.get(selectors.auth.passwordInput).type('password123');

    // Кликаем на кнопку авторизации
    cy.get(selectors.auth.loginButton).click();

    // Проверяем, что имя пользователя отображается корректно
    cy.fixture('loginUserApiResponse.json').then((mockData) => {
      cy.get(selectors.menu.username).should(
        'contain.text',
        mockData.user.name
      );
    });

    // Дожидаемся перехвата запроса
    cy.wait('@loginApi');

    // Убедимся, что accessToken был установлен приложением
    cy.getCookie('accessToken').should('exist');

    // Проверяем, что refreshToken сохранен и совпадает с моковыми данными
    cy.window().then((win) => {
      const refreshToken = win.localStorage.getItem('refreshToken');
      expect(refreshToken).to.exist;
      cy.fixture('loginUserApiResponse.json').then((mockData) => {
        expect(refreshToken).to.eq(mockData.refreshToken);
      });
    });
  });

  it('Проверка получения данных пользователя', () => {
    // Перехватываем запрос на обновление токенов и возвращаем моковые данные
    cy.intercept('POST', '/api/auth/token', {
      fixture: 'refreshTokenApiResponse.json'
    }).as('refreshTokenApi');

    // Перехватываем запрос на получение данных пользователя и возвращаем моковые данные
    cy.intercept('GET', '/api/auth/user', {
      fixture: 'getUserApiResponse.json'
    }).as('getUserApi');

    // Устанавливаем refreshToken в localStorage
    cy.fixture('loginUserApiResponse.json').then((mockData) => {
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', mockData.refreshToken);
      });
    });

    cy.getCookie('accessToken').should('not.exist');

    // Перезагружаем страницу, чтобы инициировать проверку токенов
    cy.reload();

    // Ожидание загрузки токенов и пользователя
    cy.wait('@refreshTokenApi');
    cy.wait('@getUserApi');

    // Убедимся, что accessToken был установлен приложением
    cy.getCookie('accessToken').should('exist');

    // Проверяем, что refreshToken сохранен и совпадает с моковыми данными обновлённых токенов
    cy.window().then((win) => {
      const refreshToken = win.localStorage.getItem('refreshToken');
      expect(refreshToken).to.exist;
      cy.fixture('refreshTokenApiResponse.json').then((mockData) => {
        expect(refreshToken).to.eq(mockData.refreshToken);
      });
    });
  });
});

describe('Проверка оформления заказа:', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов
    cy.intercept('GET', '/api/ingredients', (req) => {
      req.reply({ fixture: 'getIngredientsApiResponse.json' });
    }).as('getIngredientsApi');

    // Перехватываем запрос на получение данных пользователя
    cy.intercept('GET', '/api/auth/user', {
      fixture: 'getUserApiResponse.json'
    }).as('getUserApi');

    // Перехватываем запрос на создание заказа
    cy.intercept('POST', '/api/orders', {
      fixture: 'orderBurgerApiResponse.json'
    }).as('orderBurgerApi');

    // Устанавливаем токены
    cy.fixture('refreshTokenApiResponse.json').then((mockData) => {
      cy.setCookie('accessToken', mockData.accessToken);
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', mockData.refreshToken);
      });
    });

    // Загружаем приложение
    cy.visit('/');

    // Дожидаемся завершения перехвата запроса получения ингредиентов
    cy.wait('@getIngredientsApi');
    // Дожидаемся завершения перехвата запроса получения информации о пользователе
    cy.wait('@getUserApi');
  });

  it('Проверка сборки и оформления заказа', () => {
    // Добавляем все ингредиенты на странице в заказ
    cy.get(selectors.ingredient).each(($ingredient) => {
      cy.wrap($ingredient).find('button').click();
    });

    cy.getCookie('accessToken').should('exist');
    cy.window().then((win) => {
      const refreshToken = win.localStorage.getItem('refreshToken');
      expect(refreshToken).to.exist;
    });

    // Убедиться, что модальных окон не существует
    cy.get(selectors.modal).should('not.exist');

    // Проверка, что конструктор не пустой
    cy.get(selectors.constructor.emptyTopBun).should('not.exist');
    cy.get(selectors.constructor.emptyIngredients).should('not.exist');
    cy.get(selectors.constructor.emptyBottomBun).should('not.exist');

    // Подтверждаем заказ
    cy.get(selectors.constructor.confirmButton).click();

    // Ожидаем перехвата запроса и проверяем номер заказа
    cy.wait('@orderBurgerApi').then((interception) => {
      // Извлекаем номер заказа из ответа сервера
      if (interception.response) {
        const orderNumber = interception.response.body.order.number;
        // Проверяем, что элемент с моковым номером заказа существует
        cy.get(selectors.orderConfirm(orderNumber)).should('exist');
      }
    });

    // Закрыть модальное окно
    cy.get(selectors.closeModalButton).click();
    cy.get(selectors.modal).should('not.exist');

    // Убедиться, что конструктор пустой
    cy.get(selectors.constructor.emptyTopBun).should('exist');
    cy.get(selectors.constructor.emptyIngredients).should('exist');
    cy.get(selectors.constructor.emptyBottomBun).should('exist');
  });
});
