import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder,FormGroup } from '@angular/forms';


@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.scss']
})



export class AddeventComponent implements OnInit {
  minDateStart;
  minDateEnd;
  maxDateStart;

  
  preSurvey: FormArray;
  options: FormArray;
  questiontypes=["Text","RadioButton","CheckBox","DropdownList"];
  eventformats=["Tradeshows","Conferences","Workshops"];

  selectedCategory:string[]=["Education & Training","Entertainment & Media","Fashion & Beauty","Food & Beverages","Business Services"];
  showAddOptionButtion:boolean=false;
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.minDateStart=new Date();
    this.minDateEnd=new Date();
  }

  dateStartChange(event){
    this.minDateEnd=new Date(event.targetElement.value)
  }
  dateEndChange(event){
    this.maxDateStart=new Date(event.targetElement.value)
  }

  removeCategory(category){
    const index = this.selectedCategory.indexOf(category);
    if (index >= 0) {
      this.selectedCategory.splice(index, 1);
    }
  }

  eventForm=this.fb.group({
      name:[''],
      venue:[''],
      capacity:[0],
      entryFee:[0],
      dateFrom:[''],
      dateTo:[''],
      timingFrom:['09:00 am'],
      timingTo:['06:30 pm'],
      preSurvey: this.fb.array([]),
      introduction:[],
      category:[],
      organizer:[],
      eventformat:[],
      remarks:[]
  })

  createQ(): FormGroup {
    return this.fb.group({
      question:[],
      type:[],
      options:this.fb.array([])
    });
  }

  addQuestion(): void {
    this.preSurvey = this.eventForm.get('preSurvey') as FormArray;
    this.preSurvey.push(this.createQ());
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
    this.preSurvey.removeAt(index)
  }

}

