import { Component, OnInit, ChangeDetectionStrategy  } from '@angular/core';
import { FormArray, FormBuilder,FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class AddeventComponent implements OnInit  {
  minDateStart;
  minDateEnd;
  maxDateStart;

  preEventSurvey: FormArray;
  postEventSurvey: FormArray;
  options: FormArray;
  optionsPrint: FormArray;
  questionTypes=["Text","RadioButton","CheckBox","DropdownList"];
  eventFormats=["Tradeshows","Conferences","Workshops"];
  
  eventCategory:any[]=[];
  selectedCategory:FormArray;



  constructor(private fb:FormBuilder,
              public http:HttpClient,
              private eventService:EventService) { }

  ngOnInit() {
    this.minDateStart=new Date();
    this.minDateEnd=new Date();
    this.getAllEventCategories();
  }

  getAllEventCategories(){
    let _url:string="/assets/data/eventCategory";
    this.http.get(_url).subscribe((res:any)=>{
      this.eventCategory=[...res];
    })
  }

  dateStartChange(event){
    this.minDateEnd=new Date(event.targetElement.value)
   
  }
  dateEndChange(event){
    this.maxDateStart=new Date(event.targetElement.value)
  }

  removeCategory(category){
    this.selectedCategory = this.eventForm.get('category') as FormArray;
    this.selectedCategory.value.splice(this.selectedCategory.value.indexOf(category),1)
    this.eventForm.patchValue({
      category:this.selectedCategory.value
    })
  }

  eventForm=this.fb.group({
      name:['',Validators.required],
      venue:[''],
      capacity:[0],
      entryFee:[0],
      dateFrom:[''],
      dateTo:[''],
      timingFrom:['09:00 am'],
      timingTo:['06:30 pm'],
      introduction:[],
      category:[],
      organizer:[],
      eventformat:[],
      remarks:[],
      registrationEnable:['true'],
      preEventSurvey: this.fb.array([]),
      postEventSurvey: this.fb.array([]),
  })

  createQ(surveytype): FormGroup {
    if(surveytype=='pre'){
      return this.fb.group({
        question:[],
        type:[],
        options:this.fb.array([]),
        optionsPrint:this.fb.array([]),
        optional:[false],
        print:[false],
        maxChoice:[]
      });
    }else{
      return this.fb.group({
        question:[],
        type:[],
        options:this.fb.array([]),
        optional:[false],
        maxChoice:[]
      });
    }
  }



  addQuestion(surveytype): void {
    if(surveytype=='pre'){
      this.preEventSurvey = this.eventForm.get('preEventSurvey') as FormArray;
      this.preEventSurvey.push(this.createQ(surveytype));
    }else{
      this.postEventSurvey = this.eventForm.get('postEventSurvey') as FormArray;
      this.postEventSurvey.push(this.createQ(surveytype));
    }
 
  }

  changeType(type,item,surveytype){
     if(type=="Text"){
        (item.get("options") as FormArray).clear();
        this.updateMaxChoice(item);
        // item.patchValue({ maxChoice:1 })
     }else{
        if(item.get("options").value.length<=0){
            this.addOption(item,surveytype);
        }else{
            this.updateMaxChoice(item);
        }
     }
  }


  addOption(item,surveytype){
    
      this.options=item.get('options') as FormArray;
      this.options.push(this.fb.control(null,Validators.required));
      if(surveytype=='pre'){
        this.optionsPrint=item.get('optionsPrint') as FormArray;
        this.optionsPrint.push(this.fb.control(null));
      }
      this.updateMaxChoice(item);

  }

  removeOption(item,index,surveytype){
    (item.controls["options"] as FormArray).removeAt(index);
    if(surveytype=='pre'){
      (item.controls["optionsPrint"] as FormArray).removeAt(index);
    }
    this.updateMaxChoice(item);
  }


  removeQ(index,surveytype){
    if(surveytype=='pre'){
      this.preEventSurvey.removeAt(index)
    }else{
      this.postEventSurvey.removeAt(index)
    }
    
  }

  onSubmit(){
    console.log(this.eventForm.value);
    this.eventService.addNewEvent(this.eventForm.value).subscribe(data=>{
      if(data.results==1){
        alert("new event added.");
        window.location.href="";
      }else{
        alert("error..");
      }
    })
  }

  updateMaxChoice(item){
    if(item.get("type").value=="CheckBox"){
      item.get("maxChoice").patchValue(item.get("options").value.length)
    }else{
      item.get("maxChoice").patchValue(null);
    }
  }

  changePrint(item){
    if(item.get("print").value==false){
      (item.controls['optionsPrint'].controls).forEach(element => {
        element.setErrors(null);
      });
    }
  }

  
}

