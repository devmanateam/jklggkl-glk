import { Injectable } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { AlertController } from "@ionic/angular";
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  databaseObj: SQLiteObject;
  tables = {
    categories: "categories",
    persons: "persons",
  };

  constructor(private sqlite: SQLite,private alertController:AlertController) { }

  async createDatabase() {
    await this.sqlite
      .create({
        name: "ionic_sqlite_crud",
        location: "default",
      })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
      })
      .catch((e) => {
        alert("error on creating database " + JSON.stringify(e));
      });

    await this.createTables();
  }

  async createTables() {
    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.categories} (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL UNIQUE)`,
      []
    )



    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.persons} (id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER UNSIGNED NOT NULL, name VARCHAR(255) NOT NULL)`,
      []
    );
  }

  async addCategory(name: string) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.categories} (name) VALUES ('${name}')`,
        []
      )
      .then(async () => {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Favori Listesine Eklendi!',

          message: 'Film Favori Listesine Eklendi.',
          buttons: ['TAMAM'],
        });

        await alert.present();
      })
      .catch(async (e) => {
        if (e.code === 6) {
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Film Mevcut!',

            message: 'Film Favori Listesinde Mevcut.',
            buttons: ['TAMAM'],
          });
          await alert.present();
        }

        return "error on creating category " + JSON.stringify(e);
      });
  }

  async getCategories() {
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.categories} ORDER BY name ASC`,
        []
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return "error on getting categories " + JSON.stringify(e);
      });
  }

  async deleteCategory(id: string) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.categories} WHERE name = ${id}`, [])
      .then(async () => {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Film Silindi!',

          message: 'Film Favori Listesinden Silindi.',
          buttons: ['TAMAM'],

        });
        await alert.present();
      })
      .catch(async () => {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Hata!',

          message: 'Film Silinirken Bir Hata Oluştu.',
          buttons: ['TAMAM'],
        });
        await alert.present();
      });
  }

  async editCategory(name: string, id: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.categories} SET name = '${name}' WHERE id = ${id}`,
        []
      )
      .then(() => {
        return "category updated";
      })
      .catch((e) => {
        if (e.code === 6) {
          return "category already exist";
        }

        return "error on updating category " + JSON.stringify(e);
      });
  }

  async addPerson(name: string, category_id: number) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.persons} (name, category_id) VALUES ('${name}', ${category_id})`,
        []
      )
      .then(() => {
        return "person created";
      })
      .catch((e) => {
        return "error on creating person " + JSON.stringify(e);
      });
  }

  async getPersons() {
    return this.databaseObj
      .executeSql(
        `SELECT persons.id, persons.category_id, persons.name as person, categories.name as category FROM persons INNER JOIN categories ON categories.id = persons.category_id ORDER BY person ASC`,
        []
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return "error on getting persons " + JSON.stringify(e);
      });
  }

  async deletePerson(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.persons} WHERE id = ${id}`, [])
      .then(() => {
        return "person deleted";
      })
      .catch((e) => {
        return "error on deleting person " + JSON.stringify(e);
      });
  }

  async editPerson(name: string, category_id: number, id: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.persons} SET name = '${name}', category_id = ${category_id} WHERE id = ${id}`,
        []
      )
      .then(() => {
        return "person updated";
      })
      .catch((e) => {
        return "error on updating person " + JSON.stringify(e);
      });
  }
}
