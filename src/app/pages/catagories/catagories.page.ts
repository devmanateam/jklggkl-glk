import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-catagories',
  templateUrl: './catagories.page.html',
  styleUrls: ['./catagories.page.scss'],
})
export class CatagoriesPage implements OnInit {
posts:any;

kategori:any=[
  {img:"https://i.pinimg.com/originals/70/ca/4f/70ca4f14079446ae6b74d2f912cfa4bb.jpg"},
  {img:"https://unitingartists.org/wp-content/uploads/2020/06/Adventure-Genre-800x445.jpg"},
  {img:"https://webneel.net/file/images/wneel/10-2016/16-croods-2-animation-movie-2017.jpg"},
  {img:"https://cdn.shopify.com/s/files/1/0037/8008/3782/products/ace_ventura_pet_detective_EB07907_B-824371_1024x1024@2x.jpg?v=1611687792"},
  {img:"https://m.media-amazon.com/images/M/MV5BYjRkN2NhM2MtN2I4NS00MGE1LTlhZTEtODlmZWZhZGUyZTBiXkEyXkFqcGdeQXVyNjU0NTI0Nw@@._V1_.jpg"},
  {img:"https://www.arthipo.com/image/cache/catalog/genel-tasarim/all-posters/documentary-posters-belgesel/pdoc109-the-last-lions_aef0ee62-documentary-belgesel-poster-sales-1000x1000.jpg"},
  {img:"https://i.pinimg.com/originals/08/65/99/08659960e993c06b14fb05db3d0a89f5.jpg"},
  {img:"https://static2.tribute.ca/poster/660x980/family-is-family-126633.jpg"},
  {img:"https://i.pinimg.com/originals/87/e9/9e/87e99eb0661a04d5350105727ac3be23.jpg"},
  {img:"https://technext.ng/wp-content/uploads/2020/09/aaaabwtyg44-jinssfzsfwsf4bm8v-oktpsechgid0hybzagclpxbngo-q77vaq-xw8osligmkvzohzzez42goclymr7-c3rdjge8ra3mmjdkho0gais1qc-5savaa8m3w_orig-750x354.jpg"},
  {img:"https://www.ecranlarge.com/uploads/image/001/177/the-wretched-affiche-1177659.png"},
  {img:"https://asli68.files.wordpress.com/2021/03/movieposter_en.jpg"},
  {img:"https://artofvfx.com/wp-content/uploads/2019/07/knives_out_ver13_xlg.jpg"},
  {img:"https://www.thelondontree.com/wp-content/uploads/2019/12/the-notebook-e1518625675982.jpg"},
  {img:"https://cdn1.ntv.com.tr/gorsel/90PGS9_o1UOPn2JRy2FaVA.jpg?width=1000&mode=crop&scale=both"},
  {img:"https://images.moviepostershop.com/supergirl-tv-movie-poster-1000778167.jpg"},
  {img:"https://i.pinimg.com/originals/b1/ed/2f/b1ed2fa5b398c83ef8867177bf03a99e.jpg"},
  {img:"https://i.pinimg.com/originals/81/0a/ce/810ace5b49d4b2e24ef2881b4feaf668.jpg"},
  {img:"https://images-na.ssl-images-amazon.com/images/I/91JETG6FnrL.jpg"},


]
user:any = "HAHA Test";
  constructor(private client:HttpClient,private router:Router,private dataService:DataServiceService) {


  }
  ngOnInit() {

    this.client.get("https://api.themoviedb.org/3/genre/movie/list?api_key=4a9a1295d6e92d0d23fcf7c3f1ed6908&language=tr-TR").subscribe((response)=>{
      this.posts=response
    })

  }

  sendid(value){

    this.dataService.setData(42,value)
    this.router.navigateByUrl('/search/42')
  }

}
