// ссылка на каталог товаров в формате json, если вам не показывали как создать такую ссылку в репозитории напиши, я подскажу.
const CATALOG_URL =
  'https://raw.githubusercontent.com/lotostoi/GeekBrains-project/homework/responses/catalogData.json'
// ссылка на корзину товаров в формате json,
const CART_URL =
  'https://raw.githubusercontent.com/lotostoi/GeekBrains-project/homework/responses/getBasket.json'
// проммис для работы с сервером который возвращет данные полученные с сервера в формате json

let makeRequest = (url) =>
  new Promise((res, rej) => {
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
// простая функция для работы с сервером, сделанная на основен fetch или промиса makeRequest(который вы делали на основе XMLHttpRequest),
// она возвращает промис, результатом резолва которого
// являются данные полученные с сервера в формате json, и распарсенные из  json в обычный js объект,
// с помощью промиса data.json() (использыется при работе с промисом fetch)
// или меотда JSON.parse(data) (обычный способ превратить json  в объект js)
function makeRequestFetch(url) {
  console.log(url)
  // использование fetch  намного удобнее поскольку не надо писать промис makeRequest
  return fetch(url).then((data) => data.json())
  // работает  также как и строчка выше
  // return makeRequest(url).then((data) => JSON.parse(data))
}

// создаем класс товара каталога
// основной задачей этого класса на сонове данных о товара создавать объект товара

class Good {
  // закидываем в конструктор значения полей объекта  одного товара в каталоге
  constructor({ id, title, price, img }) {
    // определяем поля класс Good
    this.id = id
    this.title = title
    this.price = price
    // ссылка на картинку товара
    this.img = img
  }
  // создаем метод для получения html разментки одного товара с заданными при создании класса параметрами(id.title,price,img)
  rander() {
    // данная разметка взята из, ниже приведенного, куска твоей верстки, и которую я ее сильно упростил(находится index.html)
    // оставил только div каталога <div class="catalogue"></div>  и пока закомментированную корзину
    // (все остальное на данном этапе лишнее, и будет только сбивать восприятие кода)
    /*  <div class="container">
        <div class="catalogue">
            
        // кусок разметки который мы будем ипользовать для создaния метода получения html разметки одного товара, с заданными при создании класса, параметрами(id.title,price,img)   
        <div class="item">
          <img class="item__photo" src="img/item2.png" alt="item2" />
          <div class="item-hover">
            <a href="#">
              <div class="addCart">
                <img class="item-cart" src="img/whiteCart.svg" alt="itemCart" />
                <p class="addCart_text">Add to Cart</p>
              </div>
            </a>
          </div>
          <div class="item__info">
            <p class="item__info_name">Mango People T-shirt</p>
            <p class="item__info_price">$52.00</p>
          </div>
        </div>
         .
         .
         .
        </div>
    </div>
 */
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
// 2. Взаимодествовать с классом корзины (пока не риализованно)

class Goods {
  // констуктор класса принимает селектор блока в котором будут отрисовываться товары каталога
  constructor(selector, good, catalogURL) {
    // создаем поле container в которое заносим елемент dom с
    // селектором selector(в нашем случае это будет элемент <div class="catalogue"></div>  и соотвественно селектро `.catalogue`)
    this.container = document.querySelector(selector)
    // создаем поле в котором будут хранится данные о товарах полученные с сервера
    this.allGoods = []
    // создаем поле в котором будут хранится данные для отображения на странице,
    // данное поле формируется на совное поля  this.allGoods, и в момент создания класса оно равно this.allGoods
    // однако оно может меняться если мы например захотим делать фильтрацию товаров например по названию и т.д.
    // (этот момент может быть по началу непонятным)
    this.GoodsForShow = []
    this.url = catalogURL
    this.good = good
    this.cart = null
    // внутрений метод класса который запускает методы, которые должны сработать в момент создания класса
    this._init()
  }
  // опредялем метод _init()
  _init() {
    // при создании класса мы сначала должны получить товары с сервера
    // в данном случае мы это делаем с помощью внешней функции описаной выше на строке 31
    return makeRequestFetch(this.url)
      .then((data) => {
        //  после вызова промиса makeRequestFetch(CATALOG_URL), данные о товараx попадают в поле data
        //  можно написать console.log(data) что бы  посмотреть как эти данные выглядят в консоли
        //  CATALOG_URL путь к файлу с  данными о товарах в формате json, который лежит на сервере (задан в строке 2)

        // в момент создания класса this.allGoods = this.GoodsForShow, и в них мы заносим данные из data
        this.allGoods = data
        this.GoodsForShow = data
        //  вызывем метод _rander()  который на основе данных из this.GoodsForShow сформирует html  разметку
        //  товров в эелемете this.container = document.querySelector(selector)
        //  данный метод описан ниже
        this._rander()
      })
      .then(() => this._handler())
  }

  _rander() {
    // очищаем .innerHTML у элемента this.container = document.querySelector(selector) ( в нашем случае selector = `.catalogue`)
    this.container.innerHTML = ''
    // пробегаем по массиву  this.allGoods(с данными о товарах) методом forEach
    this.allGoods.forEach((good) => {
      // выше мы опредили класc Good (строка 40)
      // далее на его основе мы будем создавать объекты товара в каталоге
      // поскольку каждый good в массиве this.allGoods имеет следующую
      // структуру {id: 1, title: "MANGO PEOPLE T-SHIRT", price: 55, img: "img/item1.png"}
      // мы можем создать объект товара, при помощи, ранее описанного, класса Good следующим образом
      let newGood = new this.good(good)
      // далее используя метод render у созданного объекта товара newGood мы можем дабавить
      // его html разметку this.container = document.querySelector(selector)
      this.container.insertAdjacentHTML('beforeend', newGood.rander())
      // поскольку это тело цикла, после его кончания на странице будут отображены все товары из массива this.allGoods
    })
  }

  _handler() {
    this.container.addEventListener('click', (e) => {
      if (e.target.dataset.idAdd) {
        let item = this.allGoods.find((g) => +g.id === +e.target.dataset.idAdd)
        this.cart.addItem(item)
      }
    })
  }
}

// теперь вызываем вышеописанный класс Doods и в конструктор класса передаем селектр эламента(div)
// в котором мы хотим отобразить товары
// вызов этого класса запустит внутренний методо init()
// в котором с помощью промисса makeRequestFetch будут получены данные о товрах в сервера
// и затем с помощью метода _rander() эти данные будут отрисованы на странице (файл index.html)

class GoodInCart extends Good {
  constructor({ id, title, price, img, quantity, shipping }) {
    super({ id, title, price, img, quantity, shipping })
    this.quantity = quantity
    this.shipping = shipping
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
        <input class="productFeatures" type="number" value="${this.quantity}">
      </div>
      <div class="shipping">
        <p class="productFeatures">${this.shipping}</p>
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

class Cart extends Goods {
  constructor(selector, good, catalogURL) {
    super(selector, good, catalogURL)
  }

  _init() {
    super._init().then(() => {
      this.allQuantity = this.clacAllQuantity()
      this.allSum = this.clacAllSum()
    })
  }

  _rander() {
    this.container.innerHTML = ''
    this.allGoods.forEach((good) => {
      let newGood = new this.good({ ...good, shipping: 'FREE' })
      this.container.insertAdjacentHTML('beforeend', newGood.rander())
    })
  }

  _handler() {
    this.container.addEventListener('click', (e) => {
      if (e.target.dataset.idDel) {
        let item = this.allGoods.find((g) => +g.id === +e.target.dataset.idDel)
        this.removeItem(item)
      }
    })
  }

  get allQuantity() {
    return this._allQuantity
  }

  set allQuantity(val) {
    this._allQuantity = val
    let event = new Event('setAllQuantity')
    document.querySelector('body').dispatchEvent(event)
    return true
  }
  get allSum() {
    return this._allSum
  }

  set allSum(val) {
    this._allSum = val
    let event = new Event('setAllSum')
    document.querySelector('body').dispatchEvent(event)
    return true
  }

  clacAllQuantity() {
    return this.GoodsForShow.reduce((accum, g) => accum + g.quantity, 0)
  }

  clacAllSum() {
    return this.GoodsForShow.reduce(
      (accum, g) => accum + g.quantity * g.price,
      0
    )
  }

  setAllQuantity(selector) {
    document.querySelector('body').addEventListener('setAllQuantity', (e) => {
      let val = this.allQuantity + 'шт.'
      setContentInElements(selector,val)
    })
  }
  setAllSum(selector) {
    document.querySelector('body').addEventListener('setAllSum', (e) => {
      let val ='$' + this.allSum
      setContentInElements(selector,val)
    })
  }

  addItem(item) {
    let good = this.GoodsForShow.find((g) => g.id === item.id)
    if (good) {
      good.quantity++
    } else {
      this.GoodsForShow.push({ ...item, quantity: 1, shipping: 'FREE' })
    }
    console.log(this.GoodsForShow)
    this.allQuantity = this.clacAllQuantity()
    this.allSum = this.clacAllSum()
    this._rander()
  }

  removeItem(item) {
    let good = this.GoodsForShow.find((g) => g.id === item.id)
    if (good.quantity > 1) {
      good.quantity--
    } else {
      let idx = this.GoodsForShow.findIndex((g) => g.id === item.id)
      this.GoodsForShow.splice(idx, 1)
    }
    this.allQuantity = this.clacAllQuantity()
    this.allSum = this.clacAllSum()
    this._rander()
  }
}

let CartShop = new Cart('.prodInCart', GoodInCart, CART_URL)

CartShop.setAllQuantity('.header__cart-quantity')
CartShop.setAllSum('.header__cart-sum')

let Catalog = new Goods('.catalogue', Good, CATALOG_URL)

Catalog.cart = CartShop



function setContentInElements(selectors, value) {
  if (typeof selectors === 'string') {
    let elements =[... document.querySelectorAll(selectors)]
    elements.forEach(e=> {
      e.innerHTML = value
    })
  }
}

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
