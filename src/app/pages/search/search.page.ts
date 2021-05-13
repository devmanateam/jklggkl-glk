import { DatabaseService } from 'src/app/database.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonContent,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { VideopopupPage } from 'src/app/videopopup/videopopup.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  data: any;
  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;
  page: number = 1;
  engpost: any;
  posts: any;
  resim: string = 'http://image.tmdb.org/t/p/w500';
  value: any;
  home: any;
  enhome: any;
  searchtext: any;

  engeng: string = '';
  constructor(
    private route: ActivatedRoute,
    private client: HttpClient,
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController,
    private database:DatabaseService

  ) {}

  addCategory(id:number) {


    // add category

    this.database.addCategory(id.toString())



}

  ngOnInit() {
    if (this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
      this.client
        .get(
          "https://api.themoviedb.org/3/discover/movie?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR&sort_by=popularity.desc&include_adult=true&include_video=false&page="+this.page+"&with_genres=" +
            this.data +
            "&with_watch_monetization_types=flatrate"
        )
        .subscribe((response) => {
          this.posts = response;
          this.home = response;
        });
        this.client
        .get(
          'https://api.themoviedb.org/3/discover/movie?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=en-EN&sort_by=popularity.desc&include_adult=true&include_video=false&page='+this.page+'&with_genres=' +
            this.data +
            '&with_watch_monetization_types=flatrate'
        )
        .subscribe((response) => {
          this.engpost = response;
          this.enhome = response;
        });
    }
  }

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

  gohome() {
    this.posts = this.home;
    this.engeng = this.enhome;
  }
  urlx: any;
  holder: any;
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

  onNextClick() {
    try {
      this.page++;
      this.client
        .get(
          "https://api.themoviedb.org/3/discover/movie?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR&sort_by=popularity.desc&include_adult=true&include_video=false&page="+this.page+"&with_genres=" +
            this.data +
            "&with_watch_monetization_types=flatrate"
        )
        .subscribe((response) => {
          this.posts = response;
        });
        this.client
        .get(
          "https://api.themoviedb.org/3/discover/movie?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=en-EN&sort_by=popularity.desc&include_adult=true&include_video=false&page="+this.page+"&with_genres=" +
            this.data +
            "&with_watch_monetization_types=flatrate"
        )
        .subscribe((response) => {
          this.engpost = response;
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
      "https://api.themoviedb.org/3/discover/movie?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR&sort_by=popularity.desc&include_adult=true&include_video=false&page="+this.page+"&with_genres=" +
        this.data +
        "&with_watch_monetization_types=flatrate"
    )
    .subscribe((response) => {
      this.posts = response;
    });
    this.client
    .get(
      "https://api.themoviedb.org/3/discover/movie?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=en-EN&sort_by=popularity.desc&include_adult=true&include_video=false&page="+this.page+"&with_genres=" +
        this.data +
        "&with_watch_monetization_types=flatrate"
    )
    .subscribe((response) => {
      this.engpost = response;
    });
  }
}
