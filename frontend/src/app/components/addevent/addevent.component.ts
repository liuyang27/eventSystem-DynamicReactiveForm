import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder,FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.scss']
})



export class AddeventComponent implements OnInit {
  minDateStart;
  minDateEnd;
  maxDateStart;

  preEventSurvey: FormArray;
  options: FormArray;
  questionTypes=["Text","RadioButton","CheckBox","DropdownList"];
  eventFormats=["Tradeshows","Conferences","Workshops"];
  
  eventCategory:any[]=[];
  selectedCategory:FormArray;



  constructor(private fb:FormBuilder,public http:HttpClient) { }

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
      preEventSurvey: this.fb.array([]),
      introduction:[],
      category:[],
      organizer:[],
      eventformat:[],
      remarks:[],
      registrationEnable:['true']
  })

  createQ(): FormGroup {
    return this.fb.group({
      qid:[],
      question:[],
      type:[],
      options:this.fb.array([])
    });
  }

  addQuestion(): void {
    this.preEventSurvey = this.eventForm.get('preEventSurvey') as FormArray;
    this.preEventSurvey.push(this.createQ());
  }

  changeType(type,item){
     if(type=="Text"){
        (item.get("options") as FormArray).clear();
     }else{
        if(item.get("options").value.length<=0){
            this.addOption(item);
        }
     }
  }


  addOption(item){
    this.options=item.get('options') as FormArray;
    this.options.push(this.fb.control(null))
  }

  removeOption(item,index){
    // console.log(index);
    // console.log((item.controls));
    // console.log((item.controls["options"].controls[index].value));
  
    (item.controls["options"] as FormArray).removeAt(index)
  }


  removeQ(index){
    this.preEventSurvey.removeAt(index)
  }

  onSubmit(){
    console.log(this.eventForm.value)
  }

}

