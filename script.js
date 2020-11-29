// ссылка на каталог товаров
const CATALOG_URL =
  'https://raw.githubusercontent.com/lotostoi/GeekBrains-project/homework/responses/catalogData.json'

fetch(CATALOG_URL)
  .then((data) => data.json())
  .then((data) => console.log(data))

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

class Goods {
  constructor(id, name, color, size, price, quantity) {
    this.id = id
    this.name = name
    this.color = color
    this.size = size
    this.price = price
    this.quantity = quantity
  }
  addToCart() {} /* добавляет товар в корзину */
  removeFromCart() {} /* удаляет товар из корзины */
  chooseColor() {} /* выбирает цвет товара */
  chooseSize() {} /* выбирает цвет товара */
  chooseQuantity() {} /* выбирает количество единиц товара */
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
