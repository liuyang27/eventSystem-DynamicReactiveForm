import { Component, OnInit,AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editevent',
  templateUrl: './editevent.component.html',
  styleUrls: ['./editevent.component.scss'],
})
export class EditeventComponent implements OnInit,AfterContentChecked {
  eventId: string;
  minDateStart;
  minDateEnd;
  maxDateStart;

  preEventSurvey: FormArray;
  postEventSurvey: FormArray;
  options: FormArray;
  optionsPrint: FormArray;
  questionTypes = ["Text", "RadioButton", "CheckBox", "DropdownList"];
  eventFormats = ["Tradeshows", "Conferences", "Workshops"];

  eventCategory: any[] = [];
  selectedCategory: FormArray;

  eventForm;

  constructor(private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    public http: HttpClient,
    private eventService: EventService,
    private ref: ChangeDetectorRef,
    private router:Router) { }

  ngOnInit() {
    this.getAllEventCategories();
    this.activeRoute.paramMap.subscribe(params => {
      this.eventId = params.get("eid");
      this.getEvent(this.eventId)
    })
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  //load event data by ID from MongoDB
  getEvent(id) {
    this.eventService.getEventById(id).subscribe((data) => {
      var eventdata = data.results;

      this.eventForm = this.fb.group({
        name: [eventdata.name, Validators.required],
        venue: [eventdata.venue],
        capacity: [eventdata.capacity],
        entryFee: [eventdata.entryFee],
        dateFrom: [eventdata.dateFrom],
        dateTo: [eventdata.dateTo],
        timingFrom: [eventdata.timingFrom],
        timingTo: [eventdata.timingTo],
        introduction: [eventdata.introduction],
        category: [eventdata.category],
        organizer: [eventdata.organizer],
        eventformat: [eventdata.eventformat],
        remarks: [eventdata.remarks],
        registrationEnable: [eventdata.registrationEnable],
        preEventSurvey: this.fb.array([]),
        postEventSurvey: this.fb.array([]),
      })


      ///load pre-event survey
      this.preEventSurvey = this.eventForm.get('preEventSurvey') as FormArray;
      eventdata.preEventSurvey.forEach(element => {
        var tempOptions = this.fb.array([]);
        var tempOptionsPrint = this.fb.array([]);
        element.options.forEach(opt=>{
          tempOptions.push(this.fb.control(opt,Validators.required))
          if(element.print==false){
            tempOptionsPrint.push(this.fb.control(null));
          }
        })
        if(element.print==true){
          element.optionsPrint.forEach(optPrint=>{
            tempOptionsPrint.push(this.fb.control(optPrint))
          })
        }
  
        this.preEventSurvey.push(
          this.fb.group({
            question: [element.question],
            type: [element.type],
            options: tempOptions,
            optionsPrint: tempOptionsPrint,
            optional: [element.optional],
            print: [element.print],
            maxChoice: [element.maxChoice]
          })
        )
      });


       ///load post-event survey
       this.postEventSurvey = this.eventForm.get('postEventSurvey') as FormArray;
       eventdata.postEventSurvey.forEach(element => {
         var tempOptions = this.fb.array([]);
         element.options.forEach(opt=>{
           tempOptions.push(this.fb.control(opt,Validators.required))
         })

         this.postEventSurvey.push(
           this.fb.group({
             question: [element.question],
             type: [element.type],
             options: tempOptions,
             optional: [element.optional],
             maxChoice: [element.maxChoice]
           })
         )
       });

    })
  }

  getAllEventCategories() {
    let _url: string = "/assets/data/eventCategory";
    this.http.get(_url).subscribe((res: any) => {
      this.eventCategory = [...res];
    })
  }

  dateStartChange(event) {
    this.minDateEnd = new Date(event.targetElement.value)

  }
  dateEndChange(event) {
    this.maxDateStart = new Date(event.targetElement.value)
  }

  removeCategory(category) {
    this.selectedCategory = this.eventForm.get('category') as FormArray;
    this.selectedCategory.value.splice(this.selectedCategory.value.indexOf(category), 1)
    this.eventForm.patchValue({
      category: this.selectedCategory.value
    })
  }

  createQ(surveytype): FormGroup {
    if (surveytype == 'pre') {
      return this.fb.group({
        question: [],
        type: [],
        options: this.fb.array([]),
        optionsPrint: this.fb.array([]),
        optional: [false],
        print: [false],
        maxChoice: []
      });
    } else {
      return this.fb.group({
        question: [],
        type: [],
        options: this.fb.array([]),
        optional: [false],
        maxChoice: []
      });
    }
  }


  addQuestion(surveytype): void {
    if (surveytype == 'pre') {
      this.preEventSurvey = this.eventForm.get('preEventSurvey') as FormArray;
      this.preEventSurvey.push(this.createQ(surveytype));
    } else {
      this.postEventSurvey = this.eventForm.get('postEventSurvey') as FormArray;
      this.postEventSurvey.push(this.createQ(surveytype));
    }
    
  }



  changeType(type, item, surveytype) {
    if (type == "Text") {
      (item.get("options") as FormArray).clear();
      this.updateMaxChoice(item);
    } else {
      if (item.get("options").value.length <= 0) {
        this.addOption(item, surveytype);
      } else {
        this.updateMaxChoice(item);
      }
    }
  }


  addOption(item, surveytype) {

    this.options = item.get('options') as FormArray;
    this.options.push(this.fb.control(null, Validators.required));
    if (surveytype == 'pre') {
      this.optionsPrint = item.get('optionsPrint') as FormArray;
      this.optionsPrint.push(this.fb.control(null));
    }
    this.updateMaxChoice(item);

  }

  removeOption(item, index, surveytype) {
    (item.controls["options"] as FormArray).removeAt(index);
    if (surveytype == 'pre') {
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

  updateMaxChoice(item) {
    if (item.get("type").value == "CheckBox") {
      item.get("maxChoice").patchValue(item.get("options").value.length)
    } else {
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

  onSubmit(){
    console.log(this.eventForm.value);
    this.eventService.editEvent(this.eventId,this.eventForm.value).subscribe(data=>{
      console.log(data)
      if(data.results==1){
        alert("event edited successfully.");
        window.location.href="";
      }else{
        alert("error..");
      }
    })
  }

  backToHome(){
    this.router.navigate(['/',]);
  }

}
