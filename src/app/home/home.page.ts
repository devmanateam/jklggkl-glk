import { HttpClient } from '@angular/common/http';

import { VideopopupPage } from './../videopopup/videopopup.page';
import { IonContent, Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  data: any;
  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;
  page: number = 1;
  engpost: any;
  posts: any;
  resim: string = 'http://image.tmdb.org/t/p/w500';
  value: any;
  home: any;
  enhome: any;
  categoryName: string = "";
  categories: any = [];
  editMode: boolean = false;
  editId: number = 0;

  engeng: string = '';
  constructor(
    public router: Router,
    public client: HttpClient,
    private modalController: ModalController,

    private alertController: AlertController,
    private toastController: ToastController,
    public database: DatabaseService,
    public platform: Platform
  ) {
    this.client
      .get(
        'https://api.themoviedb.org/3/movie/popular?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR&page=' +
          this.page
      )
      .subscribe((response) => {
        this.posts = response;
        this.home = response;
      });
    this.client
      .get(
        'https://api.themoviedb.org/3/movie/popular?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=en-EN&page=' +
          this.page
      )
      .subscribe((response) => {
        this.engpost = response;
        this.enhome = response;
      });
      this.database.createDatabase().then(() => {
        // will call get categories
        this.getCategories();
      });
  }
  items = [];
  config = {
    spaceBetween: 0,
    centeredSlides: true,
    slidesPerView: 1.4,
    loop: true,
    autplay: true,
  };
  urlx: any;
  holder: string;
  videoURL: any;

  async myMethod() {
    await this.myContent.scrollToPoint(200, 522, 4);
  }

  engtext: any;
  engtextsend: any;

  gohome() {
    this.posts = this.home;
    this.engeng = this.enhome;
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

  ngOnInit() {

  }

  onNextClick() {
    try {
      this.page++;
      this.client
        .get(
          'https://api.themoviedb.org/3/movie/popular?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR&page=' +
            this.page
        )
        .subscribe((response) => {
          this.posts = response;
        });
    } catch {
      return;
    }
  }
  onBackClick() {
    if (this.page == 1) {
      return;
    }
    this.page--;

    this.client
      .get(
        'https://api.themoviedb.org/3/movie/popular?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR&page=' +
          this.page
      )
      .subscribe((response) => {
        this.posts = response;
      });
  }
  searchtext: string;

  search() {
    this.client
      .get(
        'https://api.themoviedb.org/3/search/movie?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR&query=' +
          this.searchtext +
          '&page=1&include_adult=true'
      )
      .subscribe((response) => {
        this.posts = response;
      });
    this.client
      .get(
        'https://api.themoviedb.org/3/search/movie?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=en-EN&query=' +
          this.searchtext +
          '&page=1&include_adult=true'
      )
      .subscribe(async (response) => {
        this.engpost = response;
        this.searchtext = undefined;
        if (this.engpost.results.length == 0) {
          const toast = await this.toastController.create({
            message: 'Maalesef aramaya uygun film bulunamadı.',
            duration: 2000,
          });
          toast.present();

          this.posts = this.home;
          this.engpost = this.enhome;
        }
      });
  }

  //---------------------------------------------------------TRYİNG NEW THİNGS --------------------------------------//

  addCategory(id:number) {


      // add category

      this.database.addCategory(id.toString())



  }

  getCategories() {
    this.database.getCategories().then((data) => {
      this.categories = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.categories.push(data.rows.item(i));
        }
      }
    });
  }


}
