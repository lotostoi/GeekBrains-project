// ссылка на каталог товаров в формате json, если вам не показывали как создать такую ссылку в репозитории напиши, я подскажу.
const CATALOG_URL =
  'https://raw.githubusercontent.com/lotostoi/GeekBrains-project/homework/responses/catalogData.json'
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
  // использование fetch  намного удобнее поскольку не надо писать промис makeRequest
  return fetch(url).then((data) => data.json())
  // работает  также как и строчка выше
  // return makeRequest(url).then((data) => JSON.parse(data))
}

// создаем класс товара каталога
// основной задачей этого класса на сонове данных о товара создавать объект товара

class Good {
  // закидываем в конструктор значения полей объекта  одного товара в каталоге
  constructor(id, title, price, img) {
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
    // оставил только div каталога <div class="catalogue"></div>  и пока закоментированную корзину
    // (все сотальное на данном этапе лишнее, и будет только сбивать восприятие кода)
    /*     <div class="container">
        <div class="catalogue">
            
        // кусок разметки который мы будем ипользовать для создаения метода получения html разментки одного товара с заданными при создании класса параметрами(id.title,price,img)   
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
                    <div class="addCart" data-id="${this.id}">
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
// 1. формирование html разметки товаров, на основе данных полученны с сервера
// 2. Взаимодествовать с классом корзины (пока не реализованно)

class Goods {
  // констуктор класса принимает селектор блока в котором будут отрисовываться товары каталога
  constructor(containerForCatalog) {
    // создаем поле container в которое заносим елемент dom с
    // селектором containerForCatalog(в нашем случае это будет элемент <div class="catalogue"></div>  и соотвественно селектро `.catalogue`)
    this.container = document.querySelector(containerForCatalog)
    // создаем поле в котром будут хранится данные о товарах полученные с сервера
    this.allCatalog = []
    // создаем поле в котром будут хранится данные для отобржения на странице,
    // данное поле формируется на совное поля  this.allCatalog, и в момент создания класса оно равно this.allCatalog
    // однако оно может меняться если мы например захотим делать фильтрацию товров например по названию и т.д.
    // (этот момент может быть по началу непонятным)
    this.catalogForShow = []
    // внутрений метод класса который запускается методы, которые должны сработать в момент его создания
    this._init()
  }
  // опредялем метод _init()
  _init() {
    // при создании каласса сначала должны получить товары с сервера
    // в данном случае мы это делаем спмощью внешней функции описаной выше на строке 31
    makeRequestFetch(CATALOG_URL).then((data) => {
      //  после вызова промиса makeRequestFetch(CATALOG_URL), данные о товаха попадают в поле data
      //  можно написать console.log(data) что бы  посмотреть как эти данные выглядят в консоле
      //  CATALOG_URL путь к файлу с  данными о товарах в формате json, который лежит на сервере (задан в строке 2)

      // в момент создания класса this.allCatalog = this.catalogForShow, и в них мы заносим данные из data
      this.allCatalog = data
      this.catalogForShow = data
      //  вызывем метод _rander()  который на основе данных из this.catalogForShow сформирует html  разметку
      //  товров в эелемете this.container = document.querySelector(containerForCatalog)
      //  данный метод описан ниже
      this._rander()
    })
  }

  _rander() {
    // очищаем .innerHTML у элемента this.container = document.querySelector(containerForCatalog) ( в нашем случае containerForCatalog = `.catalogue`)
    this.container.innerHTML = ''
    // пробегаем по массиву  this.allCatalog(с данными о товраха) методом forEach
    this.allCatalog.forEach((good) => {
      // выше мы опредили класc Good (строка 40)
      // далее на его основе мы будем создавать объекты товара в каталоге
      // поскольку каждый good в масиве this.allCatalog имеет следующую 
      // структур {id: 1, title: "MANGO PEOPLE T-SHIRT", price: 55, img: "img/item1.png"} 
      // мы можем создать объект товара, при помощи ранее описанного класса Good следующим образом       
      let newGood = new Good(good.id, good.title, good.price, good.img)
      // далее используя метод render у созданного объекта товара newGood мы можем дабавить 
      // его html разметку this.container = document.querySelector(containerForCatalog)  
      this.container.insertAdjacentHTML('beforeend', newGood.rander())
      // поскольку это тело цикла, после его кончания на странице будут отображены все товара из массива this.allCatalog
    })
  }

  // addToCart() {} /* добавляет товар в корзину */
  // removeFromCart() {} /* удаляет товар из корзины */
  // chooseColor() {} /* выбирает цвет товара */
  // chooseSize() {} /* выбирает цвет товара */
  // chooseQuantity() {} /* выбирает количество единиц товара */ */
}

// теперь вызываем вышеописанный класс Doods и в конструктор класса передаем селектр эламента(div) 
// в котором мы хотим отобразить товары
// вызов этого класса запустит внутренний методо init()
// в котором с помощью промисса makeRequestFetch будут получены данные о товрах в сервера
// и затем с помощью метода _rander() эти данные будут отрисованы на странице (файл index.html)

new Goods('.catalogue')


// Остальное позже *************************************




class Cart {
  constructor(id, name, quantity, price, img) {
    this.id = id
    this.name = name
    this.quantity = quantity
    this.price = price
    this.img = img
  }
  addItem() {} /* метод добавляет товар в корзину */
  removeItem() {} /* метод удаляет товар из корзины */
  saveCart() {} /* метод сохраняет данные в корзине */
  clearCart() {} /* метод удаляет все данные из корзины */
  changeItemQuantity() {} /* метод меняет количество единиц одного товара */
  getById() {} /* метод ищет элемент корзины по id товара */
  addDelivery() {} /* метод добавляет способ доставки */
  makeOrder() {} /* метод отправляет заказ в обработку */
  goodsSum() {} /* метод рассчитывает общую стоимостль товаров в корзине */
}

class Man extends Goods {
  constructor(id, name, color, size, price, quantity) {}
}

class Women extends Goods {
  constructor(id, name, color, size, price, quantity) {}
}

class Kids extends Goods {
  constructor(id, name, color, size, price, quantity) {}
}

class Accessories extends Goods {
  constructor(id, name, color, size, price, quantity, type) {
    super(
      id,
      name,
      color,
      size,
      price,
      quantity
    ) /* добавляется тип аксессуара: сумки, шарфы, ремни и тд. */
    this.type = type
  }
}

class HotDeals extends Accessories {
  constructor(id, name, color, size, price, quantity, type, discount) {
    super(
      id,
      name,
      color,
      size,
      price,
      quantity,
      type
    ) /* добавляем размер скидки */
    this.discount = discount
  }
  makeDiscount() {} /* метод перессчитывает стоимость с учетом скидки */
}

class Featured extends HotDeals {
  constructor(id, name, color, size, price, quantity, type, discount) {
    /* в избранном могут быть товары, которые включают все свойства из каждого класса */
  }
}

class NewArrivals extends Accessories {
  constructor(id, name, color, size, price, quantity, type) {
    /* в этом разделе могут быть все свойства, кроме скидок */
  }
}

function goodsSum(goodsArr) {
  return goodsArr.reduce(
    (sum, current) => sum + current,
    0
  ) /* goodsArr - массив стоимостей товаров, sum - сумма текущего и последующего товаров, current - стоимость текущего товара */
}
