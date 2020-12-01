// общий путь api(к данным о товарах на сервере), если вам не показывали как создать такую ссылку в репозитории напиши, я подскажу.
const BASE_URL =
  'https://raw.githubusercontent.com/lotostoi/GeekBrains-project/homework/responses/'

// объект ссылок к json файлам на сервере, для работы с каталогом товаров.
const CATALOG_URL = { goods: BASE_URL + 'catalogData.json' }

// объект ссылок к json файлам на сервере, для работы с корзиной.
const CART_URL = {
  goods: BASE_URL + 'getBasket.json',
  addById: BASE_URL + 'addToBasket.json',
  delById: BASE_URL + 'deleteFromBasket.json',
}

// создаем класс товара каталога
// основной задачей этого класса на основе данных о товара создавать объект товара
class Good {
  // закидываем в конструктор значения полей объекта одного товара в каталоге
  constructor({ id, title, price, img }) {
    // определяем поля класс Good
    this.id = id
    this.title = title
    this.price = price
    // ссылка на картинку товара
    this.img = img
  }
  // данная конструкция  ({ id, title, price, img }) означает что в конструктор класса приходит
  // объект например item который сразу разбирается с помощью деструкторизации то есть код выше можно записать следующим образом
  // constructor(item) {
  //   this.id = item.id
  //   his.title = item.title
  //   this.price = item.price
  //   this.img = item.img
  // }
  // создаем метод для получения html разметки одного товара с заданными при создании класса параметрами(id.title,price,img)
  rander() {
    // данная разметка взята из верстки которую я ее сильно упростил(находится index.html)
    //  оставил только div каталога <div class="catalogue"></div> и корзину
    // (все остальное на данном этапе лишнее, и будет только сбивать восприятие кода)

    return ` <div class="item">
                <img class="item__photo" src="${this.img}" alt="item1" />
                <div class="item-hover">
                <a href="#">
                    <div class="addCart" data-id-Add="${this.id}">
                      <img class="item-cart" src="img/whiteCart.svg" alt="itemCart" />
                      <p class="addCart_text">Add to Cart</p>
                    </div>
                </a>
                </div>
                <div class="item__info">
                <p class="item__info_name">${this.title}</p>
                <p class="item__info_price">$ ${this.price}</p>
                </div>
            </div>`
  }
}

// создаем класс каталога . В задачи данного класса входит:
// 1. формирование html разметки товаров, на основе данных полученных с сервера
// 2. Взаимодействовать с классом корзины

class Goods {
  // конструктор класса принимает  selector - селектор блока в котором будут отрисовываться товары каталога
  //                               classes - объект с названиями внешних классов(Good, Gart ...) которые будут нужны описания данного класса
  //                               URL - объект с ссылками к api которые потребуются для работы создаваемого класса
  constructor(selector, classes, URL) {
    // создаем поле container в которое заносим элемент dom с
    // селектором selector(в нашем случае это будет элемент <div class="catalogue"></div>  и соответственно селектор`.catalogue`)
    this.container = document.querySelector(selector)
    // создаем поле в котором будут хранится данные о товарах полученные с сервера
    this.allGoods = []
    // создаем поле в котором будут хранится данные для отображения на странице,
    // данное поле формируется на основе поля  this.allGoods, и в момент создания класса оно равно this.allGoods
    // однако оно может меняться если мы например захотим делать фильтрацию товаров например по названию и т.д.
    // (этот момент может быть по началу непонятным)
    this.GoodsForShow = []
    // определяем поле ссылок ссылками к api которые потребуются для работы класса
    this.url = URL
    // определяем пола дополнительных классов
    this.good = classes.good ? classes.good : null
    this.cart = classes.cart ? classes.cart : null
    // вызываем внутренний метод который запускает методы, которые должны сработать в момент создания класса
    this._init()
  }
  // определяем метод _init()
  _init() {
    // при создании класса мы сначала должны получить товары с сервера
    // в данном случае мы это делаем с помощью внешней функции описанной в конце данного файла
    return (
      makeRequestFetch(this.url.goods)
        .then((data) => {
          //  после вызова промиса makeRequestFetch(this.url.goods), данные о товараx попадают в поле data
          //  можно написать console.log(data) что бы  посмотреть как эти данные выглядят в консоли
          //  this.url.goods путь к файлу с данными о товарах в формате json, который лежит на сервере
          //  в момент создания класса this.allGoods = this.GoodsForShow, и в них мы заносим данные из data
          this.allGoods = this.GoodsForShow = data
          //  вызываем метод _rander() который на основе данных из this.GoodsForShow сформирует html разметку
          //  товаров в элементе this.container = document.querySelector(selector)
          //  данный метод описан ниже
          this._rander()
        })
        // после того как наша разметка отрисованна, с помощью метода ._handler()(который описан ниже),
        // навешиваем необходимые обработчики на элемента DOM tree ( в данном случае речь идет кнопка 'add to cart')
        .then(() => this._handler())
        // если во время выполнения данной цепочки промисов возникла ошибка выводим ее в консоль
        .catch((e) => {
          console.error(e)
        })
    )
  }

  _rander() {
    // очищаем .innerHTML у элемента this.container = document.querySelector(selector) ( в нашем случае selector = `.catalogue`)
    this.container.innerHTML = ''
    // пробегаем по массиву  this.allGoods(с данными о товарах) методом forEach
    this.allGoods.forEach((good) => {
      // выше мы определили класс Good (строка 40)
      // далее на его основе мы будем создавать объекты товара в каталоге
      // поскольку каждый good в массиве this.allGoods имеет следующую
      // структуру {id: 1, title: "MANGO PEOPLE T-SHIRT", price: 55, img: "img/item1.png"}
      // мы можем создать объект товара, при помощи, ранее описанного, класса Good следующим образом
      let newGood = new this.good(good)
      // далее используя метод render у созданного объекта товара newGood мы можем добавить
      // его html разметку this.container = document.querySelector(selector)
      this.container.insertAdjacentHTML('beforeend', newGood.rander())
      // поскольку это тело цикла, после его окончания на странице будут отображены все товары из массива this.allGoods
    })
  }

  _handler() {
    // создаем обработчик кликов для кнопок "Add to Cart"
    this.container.addEventListener('click', (e) => {
      if (e.target.dataset.idAdd) {
        // в момент клика по кнопке используя значение data атрибута кнопки, определяем ID
        // товара, и находим этот товар в массиве товаров this.allGoods
        let item = this.allGoods.find((g) => +g.id === +e.target.dataset.idAdd)
        // поскольку поле класса this.cart содержит ссылку на класс корзины, мы можем добавить найденный товар (item),
        // в корзину, вызывав метод корзины(который описан в ее классе) следующим образом:
        this.cart.addItem(item)
      }
    })
  }
}

// создаем класс товара корзины на основе класса для товара каталога(суть создания данного класса описана выше )
class GoodInCart extends Good {
  constructor({ id, title, price, img, quantity }) {
    // super({ id, title, price, img, quantity }) - вызываем конструктор родительского класса
    // данна процедура выполняет следующие действия
    /*  this.id = id
        this.title = title
        this.price = price
        this.img = img
      */
    super({ id, title, price, img, quantity })
    this.quantity = quantity
  }
  rander() {
    return `
    <div class="shoppingCart-line"></div>
    <div class="productLine">
      <div class="productDetails">
        <div class="productDetails__photo"><a href="#"><img src="${
          this.img
        }" alt="t-shirt2"></a>
        </div>
        <div class="productDetails__description">
          <h2>${this.title}</h2>
          <p>Color:<span>Red</span></p>
          <p>Size:<span>Xll</span></p>
        </div>
      </div>
      <div class="unitPrice">
        <p class="productFeatures">$${this.price}</p>
      </div>
      <div class="quantity">
        <p class="productFeatures">${this.quantity}</p>
      </div>
      <div class="subtotal">
        <p class="productFeatures">${this.quantity * this.price}</p>
      </div>
      <div class="action" data-id-del="${this.id}">
        <p class="productFeatures" data-id-del="${
          this.id
        }"><i class="fas fa-times-circle" data-id-del="${this.id}"></i></p>
      </div>
    </div>
    `
  }
}

// Создаем класс корзины . В задачи данного класса входит:
// 1. формирование html разметки корзины
// 2. Удаление/добавление ... товаров в корзине
// данный класс создается на основе класса Goods, то есть 
// в нем по наследству в нем уже будут такие метода как  _init(), _rander() и _handler().
// Однако для корректной работы данного класса нам потребуется 
// немного изменить  методы _init() и _handler()
class Cart extends Goods {
  constructor(selector, good, URL) {
    // вызов super вызывает конструктор родительского класса тем самым позволяет нам не
    // писать следующий код:
    /* constructor(selector, classes, URL) {
            this.container = document.querySelector(selector)
            this.allGoods = []
            this.GoodsForShow = []
            this.url = URL
            this.good = classes.good ? classes.good : null
            this.cart = classes.cart ? classes.cart : null
            this._init()
      }*/
    super(selector, good, URL)
  }
  // переопределяем метод родительского класса _init()
  _init() {
    // вызываем метод родительского класса и поскольку он является промисом в
    // следующем then дописываем необходимый для работы корзины функционал,  а именно устанавливаем в
    // реактивные поля this.allQuantity и this.allSum (определены ниже на основе геттеров и сеттеров)
    // значения общего количества товаров  и общей стоимости корзины(с помощью методов данного класса clacAllQuantity()
    // и  this.clacAllSum() описанных ниже)
    super
      ._init()
      .then(() => {
        this.allQuantity = this.clacAllQuantity()
        this.allSum = this.clacAllSum()
      })
      .catch((e) => {
        console.error(e)
      })
  }
  // переопределяем родительский обработчик, по сути он работает так же как и родительский,
  // только здесь он навешивается на другие кнопки, и поскольку сейчас  мы находимся непосредственно
  // в самом классе корзины мы можем просто использовать ее метод.
  _handler() {
    this.container.addEventListener('click', (e) => {
      if (e.target.dataset.idDel) {
        let item = this.allGoods.find((g) => +g.id === +e.target.dataset.idDel)
        this.removeItem(item)
      }
    })
  }

  // *** определяем геттер общего количества товаров в корзине
  // *** данный участок кода является сложным для новичков, его можно пропустить
  // *** и попытаться понять в свободное время, когда другие темы будут поняты
  get allQuantity() {
    return this._allQuantity
  }
  // *** определяем геттер общего количества товаров в корзине
  // *** данный участок кода является сложным для новичков, его можно пропустить
  // *** и попытаться понять в свободное время, когда другие темы будут поняты
  set allQuantity(val) {
    this._allQuantity = val
    let event = new Event('setAllQuantity')
    document.querySelector('body').dispatchEvent(event)
    return true
  }
  // *** определяем геттер общего количества товаров в корзине
  // *** данный участок кода является сложным для новичков, его можно пропустить
  // *** и попытаться понять в свободное время, когда другие темы будут поняты
  get allSum() {
    return this._allSum
  }
  // *** определяем геттер общего количества товаров в корзине
  // *** данный участок кода является сложным для новичков, его можно пропустить
  // *** и попытаться понять в свободное время, когда другие темы будут поняты
  set allSum(val) {
    this._allSum = val
    let event = new Event('setAllSum')
    document.querySelector('body').dispatchEvent(event)
    return true
  }

  // Метод для реактивного изменения .innerHTML дом элементов.
  // данный метод будет устанавливать значение this.allQuantity(общее количество товаров корзины)
  // в элементы с селекторами определенными в selectors
  // *** данный участок кода является сложным для новичков, его можно пропустить
  // *** и попытаться понять в свободное время, когда другие темы будут поняты
  setAllQuantity(selectors) {
    document.querySelector('body').addEventListener('setAllQuantity', (e) => {
      let val = this.allQuantity + 'шт.'
      // вспомогательная функция определенная в конце данного файла
      setContentInElements(selectors, val)
    })
  }
  // Метод для реактивного изменения .innerHTML дом элементов.
  // данный метод будет устанавливать значение this.allSum(общее количество товаров корзины)
  // в элементы с селекторами определенными в selectors
  // *** данный участок кода является сложным для новичков, его можно пропустить
  // *** и попытаться понять в свободное время, когда другие темы будут поняты
  setAllSum(selectors) {
    document.querySelector('body').addEventListener('setAllSum', (e) => {
      let val = '$' + this.allSum
      // вспомогательная функция определенная в конце данного файла
      setContentInElements(selectors, val)
    })
  }

  // метод для расчета общего количества товаров в корзине
  clacAllQuantity() {
    return this.GoodsForShow.reduce((accum, g) => accum + g.quantity, 0)
  }
  // метод для расчета полной суммы корзины
  clacAllSum() {
    return this.GoodsForShow.reduce(
      (accum, g) => accum + g.quantity * g.price,
      0
    )
  }

  // дополнительный метод, который нужно вызывать когда массив с
  // товарами корзины изменился(добавили товара, удалили товар).
  _reRender() {
    this.allQuantity = this.clacAllQuantity()
    this.allSum = this.clacAllSum()
    this._rander()
  }
  // метод для добавления товара в корзину
  addItem(item) {
    // делаем запрос на сервер, на разрешение добавления товара в корзину  
    makeRequestFetch(this.url.addById)
      .then(({ result }) => {
        // если сервер ответил {"result":1} то добавляем товара 
        if (result) {
          // ищем товар item в корзине по id
          let good = this.GoodsForShow.find((g) => g.id === item.id)
          // если товар с в корзине есть
          if (good) {
            //  увеличиваем его количество на 1
            good.quantity++
          } else {
            // если такого товара в корзине нету то добавляем его в корзину  
            this.GoodsForShow.push({ ...item, quantity: 1 })
          }
          // с помощью метода _reRender() обновляем данные о корзине в HTML разметке
          this._reRender()
        } else {
          // если сервер ответил ответом отличным от {"result":1} , выбрасываем ошибку
          throw new Error("Server's answer isn't correct...")
        }
      })
      .catch((e) => {
        // если при обращению к серверу возникла  ошибка выводим ее в консоль
        console.error(e)
      })
  }
 // метод для удаления товара из корзины или уменьшения его количества
  removeItem(item) {
    // делаем запрос на сервер, на разрешение удаления товара из корзины или уменьшения его количества
    makeRequestFetch(this.url.delById)
      .then(({ result }) => {
        if (result) {
          // если сервер ответил {"result":1} то ищем товар item в корзине по id
          let good = this.GoodsForShow.find((g) => g.id === item.id)
          if (good.quantity > 1) {
            // если количество данного товара в корзине < 1 то уменьшаем его н 1
            good.quantity--
          } else {
            // если количество данного товара в корзине = 1 то удаляем его из массива товаров корзины 
            let idx = this.GoodsForShow.findIndex((g) => g.id === item.id)
            this.GoodsForShow.splice(idx, 1)
          }
          this._reRender()
        } else {
          // если сервер ответил ответом отличным от {"result":1} , выбрасываем ошибку
          throw new Error("Server's answer isn't correct...")
        }
      })
      .catch((e) => {
        // если при обращению к серверу возникла  ошибка выводим ее в консоль
        console.error(e)
      })
  }
}

// Вызываем вышеописанный класс Cart и в конструктор класса 
// передаем необходимые параметры(описание которых есть в классе Goods) 
// Вызов этого класса запустит внутренний метод init()
// в котором с помощью промисса makeRequestFetch будут получены данные о товарах  корзины с сервера
// и затем с помощью метода _rander() эти данные будут отрисованы на странице(корзины) (файл index.html)
let CartShop = new Cart('.prodInCart', { good: GoodInCart }, CART_URL)

// определяем дом элементы в которых  мы хотим отображать общее количество товаров в корзине 
CartShop.setAllQuantity('.header__cart-quantity')
// определяем дом элементы в которых  мы хотим отображать полную стоимость корзины 
CartShop.setAllSum('.header__cart-sum')

// Вызываем вышеописанный класс Doods и в конструктор класса 
// передаем необходимые параметры(описание которых есть в классе Goods) 
// Вызов этого класса запустит внутренний метод init()
// в котором с помощью промисса makeRequestFetch будут получены данные о товарах каталога с сервера
// и затем с помощью метода _rander() эти данные будут отрисованы на странице(каталога) (файл index.html)
new Goods('.catalogue', { good: Good, cart: CartShop }, CATALOG_URL)


//обработчик для переключения между каталогом и корзиной на странице проекта
document.querySelector('body').addEventListener('click', (e) => {
  if (e.target.classList.contains('header__cart')) {
    document.querySelector('.catalogue').classList.add('hiden')
    document.querySelector('.productsCart').classList.remove('hiden')
  }
  if (e.target.classList.contains('header__toCatalog')) {
    document.querySelector('.productsCart').classList.add('hiden')
    document.querySelector('.catalogue').classList.remove('hiden')
  }
})

// дополнительная функция для задания innerHTML элементов дом с определенными селекторами, значения value 
function setContentInElements(selectors, value) {
  if (typeof selectors === 'string') {
    let elements = [...document.querySelectorAll(selectors)]
    elements.forEach((e) => {
      e.innerHTML = value
    })
  } else {
    // надо дописать для массива селекторов
  }
}

// простая функция для работы с сервером, сделанная на основен fetch или промиса makeRequest(который вы делали на основе XMLHttpRequest),
// она возвращает промис, результатом резолва которого
// являются данные полученные с сервера в формате json, и распарсенные из  json в обычный js объект,
// с помощью промиса data.json() (используется при работе с промисом fetch)
// или метода JSON.parse(data) (обычный способ превратить json  в объект js)
function makeRequestFetch(url) {
  // использование fetch  намного удобнее поскольку не надо писать промис makeRequest
  return fetch(url).then((data) => data.json())
  // работает  также как и строчка выше
  // return makeRequest(url).then((data) => JSON.parse(data))
}


// промис makeRequest на основе XMLHttpRequest, древность, лучше не использовать.
function makeRequest(url) {
  return new Promise((res, rej) => {
    let xhr
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest()
    } else if (window.ActiveXObject) {
      xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xhr.open('GET', url, true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          rej('Error')
        } else {
          res(xhr.responseText)
        }
      }
    }
    xhr.open('GET', url, true)
    xhr.send()
  })
}
