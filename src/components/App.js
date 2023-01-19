import React,{Component} from 'react';
import {EMPTY, fromEvent} from 'rxjs';
import {map, debounceTime,distinctUntilChanged,
    switchMap,mergeMap,tap,catchError,filter} from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';

import Header from './Header';
import styles from './App.module.scss';

const url='https://api.github.com/search/users?q=';

class App extends Component
{
    constructor()
    {
        super();
        this.state={users: []};
    }

    componentDidMount=()=>
    {
        const search=document.querySelector('input');
        console.log(search);

        this.stream=fromEvent(search,'input').
        pipe(map(e=>e.target.value),
        debounceTime(1500),
        distinctUntilChanged(),
        tap(()=>this.setState(({users: []}))),
        filter(v=>v.trim()),
        switchMap(v=>ajax.getJSON(url+v).
        pipe(catchError(err=>EMPTY))),
        map(response=>response.items),
        mergeMap(items=>items));
        this.subscription=this.stream.subscribe(user=>
        this.setState(prevState=>({users: [...prevState.users,user]})));
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
            
            {this.state.users.length===0 &&
            (
                <div className={styles.div_empty}>Empty list</div>
            )}
        </>
    );
}

export default App;