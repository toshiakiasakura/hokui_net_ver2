import React, { Component } from 'react'
import { Route, Switch, Link, Redirect} from 'react-router-dom'
import { AdminService } from '../../services/admin.service'
import { TransitionButton } from '../../helpers/utils.component'
import { Class_Year } from '../../entity/study.entity'
import { TableRow } from '../../helpers/utils.component'
import { MatchIDType, OneClassStatus } from '../../helpers/types.helper'
import { DetailPageContainer } from '../../helpers/admin-utils.component'

type ClassYearState = {
  years: Class_Year[] | null,
  status: number
}

const YearRow = (props:{year:Class_Year} ) => {
  return(
    <tr>
      <td> 
        {props.year.id} 
      </td>
      <td> 
        <Link to={`/admin/year/${props.year.id}`}>
          {props.year.year}期 
        </Link>
      </td>
      <td> 
        {props.year.year} 期のカリキュラム 
      </td>
    </tr>
  )
}


class ClassYearBoard extends Component<{},ClassYearState>{
  constructor(props:any){
    super(props)
    this.state= {
      years: null,
      status: 200,
    }
  }

  componentDidMount(){
    AdminService.getClassYearBoard()
    .then( res => {
      this.setState({
        years: res.data.years,
        status: res.data.status
      })
    })
  }

  render(){
    let years = this.state.years
    let status = this.state.status
    console.log("/admin/subject page started")
    console.log(status)
    if( status === 404 || status === 401 ){
      return <Redirect to='/error' />
    } else if(years=== null){
      return <div> 読み込み中 </div>
    }

    let content =  years.map(year =>
        <YearRow year={year} />
    )

    return(
      <div>
        <p>
          <TransitionButton title="新規作成" url='/admin/year/new' />
        </p>
        <table className="table table--condensed">
          <thead className="table__head">
            {/*TO DO: sorting function.  */}
            <th> ID </th>
            <th> 期 </th>
            <th> カリキュラム </th>
          </thead>
          <tbody className="table__body">
            {content}
          </tbody>
        </table>
      </div>

    )
  }
}

function ClassYearEdit(){
  return(
    <div>ここにーフォーム</div>
  )
}

class ClassYearDetail extends Component<
    MatchIDType, 
    OneClassStatus<Class_Year>  
  >{

  constructor(props:any){
    super(props)
    this.state = {
      content: null,
      status: 200,
    }
  }

  componentDidMount(){
    const id = this.props.match.params.id
    AdminService.getOneDetail<Class_Year>(`year/${id}`)
    .then(res =>{
      let content= {id:1, year:1, created_at:'', updated_at:''}
      this.setState({
        //content: res.data.content,
        //status: res.data.status
        content: content,
        status: 200,
      })
    })
  }

  render(){
    console.log("ClassYearDetail page started. ")
    let content = this.state.content
    let status = this.state.status
    if (status === 404 || status === 401){
      return ( <Redirect to='/error' />)
    } else if (content === null){
      return (<div> 読み込み中 </div>)
    } 
    return(
      <DetailPageContainer 
        title={`${content.year}期`}
        editPage={<ClassYearEdit />}
        kind="year"
        id={this.props.match.params.id}
       >
        <table className='table table--bordered'>
          <tbody>
            <TableRow rowName='ID' item={content.id}/>
            <TableRow rowName='期' item={content.year}/>
            {/* TO DO: set link */}
            <TableRow rowName='カリキュラム' item={`${content.year}のカリキュラム`}/>
            <TableRow rowName='作成日' item={content.created_at}/>
            <TableRow rowName='更新日' item={content.updated_at}/>
          </tbody>
        </table>

      </DetailPageContainer>
    )
  }
}

function ClassYearPages(){
  return(
    <Switch>
      <Route exact path='/admin/year' component={ClassYearBoard} />
      <Route path='/admin/year/:id' component={ClassYearDetail} />
      {/** TO DO: add new */}
    </Switch>
  )
}
export { ClassYearPages }
