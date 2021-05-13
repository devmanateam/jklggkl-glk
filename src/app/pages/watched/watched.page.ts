import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { DatabaseService } from 'src/app/database.service';
import { VideopopupPage } from 'src/app/videopopup/videopopup.page';

@Component({
  selector: 'app-watched',
  templateUrl: './watched.page.html',
  styleUrls: ['./watched.page.scss'],
})
export class WatchedPage implements OnInit {
  categoryName: string = '';
  categories: any = [];
  editMode: boolean = false;
  editId: number = 0;
  movieid: number;
  page: any;
  posts: any;
  home: any;
  engpost: any;
  enhome: any;

  urlx:any;
  holder:any;
  resim: string = 'http://image.tmdb.org/t/p/w500';
  constructor(
    public database: DatabaseService,
    public platform: Platform,
    public client: HttpClient,
    private modalController:ModalController,
    private alertController:AlertController
  ) {
    this.database.createDatabase().then(() => {

      this.getCategories();

    });



  }

  ngOnInit() {

  }


  async videomodal(value) {
    this.client
      .get(
        'https://api.themoviedb.org/3/movie/' +
          value +
          '/videos?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR'
      )
      .subscribe(async (response) => {
        this.urlx = response;
        console.log(this.urlx);

        if (this.urlx.results.length > 0) {
          this.holder = this.urlx.results[0].key;
          console.log('KEY: ' + this.holder);

          const modal = this.modalController.create({
            component: VideopopupPage,
            cssClass: 'my-modal-css',
            componentProps: {
              passurl: 'https://www.youtube.com/embed/' + this.holder,
            },
          });
          return (await modal).present();
        } else {
          this.client
            .get(
              'https://api.themoviedb.org/3/movie/' +
                value +
                '/videos?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=en-EN'
            )
            .subscribe(async (response) => {
              try {
                this.urlx = response;
                console.log(this.urlx);
                this.holder = this.urlx.results[0].key;
                console.log('KEY: ' + this.holder);

                const modal = this.modalController.create({
                  component: VideopopupPage,
                  cssClass: 'my-modal-css',
                  componentProps: {
                    passurl: 'https://www.youtube.com/embed/' + this.holder,
                  },
                });
                return (await modal).present();
              } catch (e) {
                const alert = await this.alertController.create({
                  cssClass: 'my-custom-class',
                  header: 'Hata!',

                  message: 'Türkçe Veya İngilizce fragmanı mevcut değil.',
                  buttons: ['TAMAM'],
                });

                await alert.present();
              }
            });
        }
      });
  }


  listpost: any = [];
  enlistpost:any=[];

getmovielist(){


  this.listpost=[];
  try{
  this.categories.forEach(element => {



      this.client
      .get(
        'https://api.themoviedb.org/3/movie/' +
          element.name +
          '?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR'
      )
      .subscribe((response) => {
        this.listpost.push(response);
      });
          //İngilizce versiyon
      this.client
      .get(
        'https://api.themoviedb.org/3/movie/' +
          element.name +
          '?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=en-EN'
      )
      .subscribe((response) => {
        this.enlistpost.push(response);


      });


  });
}
catch(e){

  alert("bi hata var aga"+JSON.stringify(e))
      }
}
  getCategories() {
    this.database.getCategories().then((data) => {
      this.categories = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.categories.push(data.rows.item(i));
        }

      }
      this.getmovielist();

    });
  }

  async deleteCategory(id: string) {


    const alert= await this.alertController.create({
      header:'Favori Silinecek.',
      message:'Emin misiniz?',
      buttons:[
        {
          text:"Hayır"

        },
        {
          text:"Evet",
          handler:()=>{

            this.database.deleteCategory(id.toString()).then((data) => {



              this.getCategories();

            });

          }
        }
      ]

    })
    await alert.present();

  }

  editCategory(category: any) {
    this.editMode = true;
    this.categoryName = category.name;
    this.editId = category.id;
  }

  getClass(value: any): string {
    if (value > 8) {
      return 'larger-than-eight';
    }

    if (value > 6 && value < 8) {
      return 'six-to-eight';
    }

    if (value < 6) {
      return 'less-than-six';
    }
  }


}
