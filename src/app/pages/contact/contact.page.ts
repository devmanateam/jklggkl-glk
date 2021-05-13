import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailComposer} from '@ionic-native/email-composer/ngx'
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

xname:string;
xemail:string;
xphone:string;
xmessagebox:string;
stringsel:string;

data:any[]=[];
selectedVal:number=1;
  registrationForm=this.formBuilder.group({
    name:['',[Validators.required,Validators.maxLength(50)]],
    email:['',[Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    phone:[''],
    messageBox:['',[Validators.required,Validators.maxLength(500),Validators.minLength(5)]],
    selected:['',[Validators.required]]
  });

  constructor(private formBuilder:FormBuilder,public emailComposer:EmailComposer,private safariViewController:SafariViewController) {

    this.data=[
      {id:1,name:'Öneri'},
      {id:2,name:'Görüş'},
      {id:3,name:'Şikayet'},
      {id:4,name:'Hata Bildirimi'},
      {id:5,name:'İstek'},
      {id:6,name:'Soru'},

    ]
   }

   moveFocus(nextElement) {

    nextElement.setFocus();

}
   OnChange(event){
     this.stringsel=event.target.value

   }
   openTikTok(){
    this.safariViewController.isAvailable()
    .then((available: boolean) => {
        if (available) {

          this.safariViewController.show({
            url: 'http://tiktok.com/@filmist',
            hidden: false,
            animated: false,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#ff0000'
          })
          .subscribe((result: any) => {
              if(result.event === 'opened') console.log('Opened');
              else if(result.event === 'loaded') console.log('Loaded');
              else if(result.event === 'closed') console.log('Closed');
            },
            (error: any) => console.error(error)
          );

        } else {
          // use fallback browser, example InAppBrowser
        }
      }
    );
   }

  public submit(){

    let email={
      to:'destek.filmist@hotmail.com',
      cc:[],
      bcc:[],
      attachment:[],
      subject:this.stringsel,
      body: this.xname+' '+
      this.stringsel+' '+
      this.xmessagebox,
      isHtml:false,
      app:"Gmail"
    }
    this.emailComposer.open(email);
    console.log(this.registrationForm.value);
  }

  get name(){
    return this.registrationForm.get('name')
  }
  get email(){
    return this.registrationForm.get('email')
  } get phone(){
    return this.registrationForm.get('phone')
  } get messageBox(){
    return this.registrationForm.get('messageBox')
  }
get selected(){
  return this.registrationForm.get('selected')
}
  public errorMessages={
    name:[
      {type:'required',message:'İsim Yazılması Zorunludur'},
      {type:'maxlength',message:'İsim 50 Karakterden uzun olamaz.'}
    ],
    email:[
      {type:'required',message:'E-Mail Yazılması Zorunludur'},
      {type:'pattern',message:'Lütfen geçerli bir E-Mail adresi girin.'}

    ],
    messageBox:[
      {type:'required',message:'Mesaj Yazılması Zorunludur'},
      {type:'minlength',message:'Mesaj en az 5 karakter olmalıdır.'},
      {type:'maxlength',message:'Mesaj 500 karakterden uzun olmamalıdır.'}
    ],
    selected:[
      {type:'required',message:'Bildirim Türü Seçilmesi Zorunludur.'},

    ],



  }
  ngOnInit() {
  }

}
