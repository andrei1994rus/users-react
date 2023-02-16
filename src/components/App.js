import React,{Component} from 'react';
import {EMPTY, fromEvent} from 'rxjs';
import {map, debounceTime,distinctUntilChanged,
    switchMap,mergeMap,tap,catchError,filter} from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';
import $ from 'jquery';

import Header from './Header';
import styles from './App.module.scss';

const url='https://api.github.com/search/users?';

class App extends Component
{
    constructor()
    {
        super();
        this.state=
        {
            users: [],
            div_empty__class: styles.div_empty
        };
    }

    jqueryGetUsers=value=>
    {
        $.ajax(
        {
            type:'GET',
            url:url+$.param({q:value}),
            success:(data)=>this.setState({users: data.items})
        });
    }

    componentDidMount=()=>
    {
        const search=document.querySelector('input');
        
        console.log("Modernizr.xhrresponsetypejson:"+Modernizr.xhrresponsetypejson);
        console.log(("Modernizr.cssvmaxunit:"+Modernizr.cssvmaxunit));
        
        if(!Modernizr.cssvmaxunit)
        {
            this.setState({div_empty__class: styles.nocssvmaxunit__div_empty});
        }

        if(!Modernizr.xhrresponsetypejson)
        {
            console.log(`xhrresponsetypejson isn't supported by browser!Using rxjs+jquery.`);

            try
            {
                this.stream=fromEvent(search,'input').
                pipe(map(e=>e.target.value),
                debounceTime(1500),
                distinctUntilChanged(),
                tap(()=>this.setState(({users: []}))),
                filter(v=>v.trim()));
                this.subscription=this.stream.subscribe(v=>this.jqueryGetUsers(v));
            } 
            
            catch(e)
            {
                console.log(e);
            }
        }

        if(Modernizr.xhrresponsetypejson)
        {
            console.log('xhrresponsetypejson is supported by browser!Using rxjs+rxjs/ajax.');

            this.stream=fromEvent(search,'input').
                pipe(map(e=>e.target.value),
                debounceTime(1500),
                distinctUntilChanged(),
                tap(()=>this.setState(({users: []}))),
                filter(v=>v.trim()),
                switchMap(v=>ajax.getJSON(url+'q='+v).
                pipe(catchError(err=>EMPTY))),
                map(response=>response.items),
                mergeMap(items=>items));
            this.subscription=this.stream.subscribe(user=>
                this.setState(prevState=>({users: [...prevState.users,user]})));
        }
    }

    componentDidUpdate=()=>
    {
        if(this.state.users.length===0 || !this.state.users)
        {
            if(!Modernizr.cssvmaxunit)
            {
                const div_empty=document.querySelector(`.${styles.nocssvmaxunit__div_empty}`);
                console.log('componentDidUpdate:',div_empty);
                
                div_empty.style.fontSize=(window.outerWidth>window.outerHeight) ? '4.5vw' : '4.5vh';
            }
        }
    }

    componentWillUnmount=()=>
    {
        this.subscription.unsubscribe();
    }

    mapItems=(item,index)=>
    {
        const {login,avatar_url,html_url}=item;
        
        return (
            <div className={styles.div_user} key={index}>
                <div className={styles.div_user__avatar}>
                    <a href={html_url} target='_blank'>
                        <img src={avatar_url} alt="avatar"></img>
                    </a>
                </div>
                <div className={styles.div_user__login}>{login}</div>
            </div>
        );
    }

    render=()=>
    (
        <>
            <Header/>
            <div className={styles.div_input_field}>
                <input type="text" id={styles.search} placeholder="search Github users"/>
            </div>
            <div className={styles.div_warning1}>This app uses Github api.</div>
            <div className={styles.div_warning2}>This app searches users 1.5 seconds after typing.</div>
            <div className={styles.div_warning3}>You may click user's avatar to go his profile.</div>
            
            {this.state.users.length>0 &&
            (
                <div className={styles.div_list}>
                    {this.state.users.map((item,index)=>this.mapItems(item,index))}
                </div>
            )}
            
            {(this.state.users.length===0 || !this.state.users) &&
            (
                <div className={this.state.div_empty__class}>Empty list</div>
            )}
        </>
    );
}

export default App;