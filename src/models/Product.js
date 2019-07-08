const fs = require('fs')
const path = require('path')

module.exports = class Product {
  filePath() {
    return path.join(
      path.dirname(process.mainModule.filename),
      'src/public/files',
      'product.json'
    )
  }

  readProduct(cb, reject) {
    fs.readFile(this.filePath(), (err, fileContent) => {
      let data = []
      if (!err) {
        data.push(JSON.parse(fileContent))
      } else {
        reject(data);
      }
      cb(data[0])
    })
  }

  writeProduct(data, reject, cb) {
    fs.writeFile(this.filePath(), JSON.stringify(data), (err) => {
      if (err) {
        console.log(err)
        reject("Something went wrong!")
      }
      cb()
    })
  }

  getAll() {
    return new Promise((resolve, reject) => {
      let output = []
      this.readProduct(data => {
        output.push(data)
        resolve(output);
      }, reject)
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.readProduct(data => {
        const product = data.find(p => p.id === id)
        resolve(product);
      }, reject)
    });
  }

  save(product) {
    return new Promise((resolve, reject) => {
      this.readProduct(data => {
        product.id = Math.floor(Math.random()*100)
        data.push(product)
        this.writeProduct(data, reject, () => resolve("Product added successfully!"))
      }, reject)
    });
  }

  update(product, id) {
    const updateProduct = (resolve, reject) => {
      this.readProduct(data => {
        const product_old = data.find(p => p.id === id)
        if (product_old) {
          product.id = product_old.id
          for (var i in data) {
            if (data[i].id == product_old.id) {
              data[i] = product;
              break;
            }
          }
          this.writeProduct(data, reject, () => resolve("Product updated successfully!"))
        } else {
          resolve("Nothing to update!")
        }
      }, reject)
    };

    return new Promise(updateProduct);
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.readProduct(data => {
        const product_old = data.find(p => p.id === id)
        if (product_old) {
          data.pop(product_old)
          this.writeProduct(data, reject, () => resolve("Product deleted successfully!"))
        } else {
          resolve("Nothing to delete!")
        }
      }, reject)
    });
  }
}