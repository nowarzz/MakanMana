import React, { useState,useEffect } from 'react';
import { FlatList, Alert,StyleSheet } from 'react-native';
import {
  Container,
  Content,
  Spinner,
  Header,
  Title,
  Body,
  Right,
  Left,
  Button,
  Icon,
  Text
} from 'native-base';
import {
  Table,TableWrapper,Cell
} from 'react-native-table-component';
import mRestoran from '../Model/Restoran';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import Reactotron from 'reactotron-react-native';
const mWil = new mRestoran();
export default function Restoran(props){

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNext,setIsLoadingNext] = useState(false);
  const [restoranData, setRestoranData] = useState([{
    _id: "Kode Restoran",
    namaRestoran: "Nama Restoran",
    action: "Action",
    isHeader: true
  }]);
  const [fixedHeader, setFixedHeader] = useState([]);
  const [refreshing,setRefreshing] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const styles = StyleSheet.create({
    header: { height: 50, backgroundColor: "#3F51B5" },
    text: { margin: 10, fontFamily: "Roboto_medium" },
    row: { flexDirection: "row", backgroundColor: "#fff" }
  });

  useEffect(()=>{
    lor(this);
    var rows = [];
    rows.push({
      _id: "Kode Restoran",
      namaRestoran: "Nama Restoran",
      action:"Action",
      isHeader:true
    });
    rows.push(0);
    setFixedHeader(rows);
    loadData();
    const didFocusListener = props.navigation.addListener('didFocus',componentFocus);
    return (()=> {
      rol(this);
      didFocusListener.remove();
    });
  },[]);

  componentFocus = payload => {
    loadData();
  }

  const loadData = ()=> {
    Reactotron.log(`Loading Data`);
    setIsLoading(true);
    mWil.resetOffset();
    mWil.loadNextPage().then(resp => {
      if(resp.success){
        Reactotron.log(resp);
        var docHeader = restoranData.filter(el => el.isHeader);
        var newData = docHeader.concat(resp.data);
        setRestoranData(newData);
        setIsEnd(resp.isEnd);
      }else{
        setRestoranData(wilayaData.filter(el=>el.isHeader));
      }
    }).catch(err => {
      Alert.alert("Unexpected Error",`${err.name}: ${err.message}`);
    }).finally(() => {
      setIsLoading(false);
      setRefreshing(false);
    });
  }

  const loadNextPage = ()=>{
    if(isLoading) return;
    if(isLoadingNext) return;
    if(isEnd) return;
    setIsLoadingNext(true);
    mWil.loadNextPage().then(resp => {
      if (resp.success) {
        var newData = restoranData.concat(resp.data);
        setRestoranData(newData);
        setIsEnd(resp.isEnd);
      }
    }).catch(err => {
      Alert.alert("Unexpected Error", `${err.name}: ${err.message}`);
    }).finally(() => {
      setIsLoadingNext(false);
    });
  }

  const onRefresh = ()=> {
    setRefreshing(true);
    loadData();
  }

  const onBack = ()=> {
    loadData();
  }

  const bukaDetail = (kodeRestoran)=>{
    props.navigation.navigate('RestoranDetail',{
      kodeRestoran,
      onBack
    });
  }

  const renderButtonEdit = (item)=>{
    return (
      <Button transparent onPress={bukaDetail.bind(null,item._id)}>
        <Icon name="edit" type="FontAwesome5" />
      </Button>
    )
  }

  const _renderItem = ({item})=> {
    Reactotron.log("Render is called");
    if(item.isHeader){
      return(
        <Table borderStyle={{ borderColor: '#C1C0B9' }}>
          <TableWrapper style={{ ...styles.header, flexDirection: "row" }}>
            <Cell
              data={item._id}
              textStyle={{ ...styles.text, color: "#fff" }}
              style={{ width: wp(30) }}
            />
            <Cell
              data={item.namaRestoran}
              textStyle={{ ...styles.text, color: "#fff" }}
              style={{ width: wp(45) }}
            />
            <Cell
              data={item.action}
              textStyle={{ ...styles.text, color: "#fff" }}
              style={{ width: wp(20) }}
            />
          </TableWrapper>
        </Table>
      )
    }else{
      return(
        <Table borderStyle={{ borderColor: '#C1C0B9' }}>
          <TableWrapper style={styles.row}>
            <Cell
              data={item._id}
              textStyle={{ ...styles.textStyle }}
              style={{ width: wp(30) }}
            />
            <Cell
              data={item.namaRestoran}
              textStyle={{ ...styles.text }}
              style={{ width: wp(45) }}
            />
            <Cell
              data={renderButtonEdit(item)}
              textStyle={{ ...styles.text }}
              style={{ width: wp(20) }}
            />
          </TableWrapper>
        </Table>
      )
      
    }
  }

  const renderFooter = ()=> {
    if(isLoading) return (null);
    if(isLoadingNext) return(<Spinner />);
    return(null);
  }

  const renderHeader = ()=> {
    return(
      <Header>
        <Left>
          <Button transparent
            onPress={() => props.navigation.toggleDrawer()}>
              <Icon name="bars" type="FontAwesome" />
          </Button>
        </Left>
        <Body>
          <Title>Restoran</Title>
        </Body>
        <Right />
      </Header>
    )    
  }

  const addRestoran = ()=>{
    props.navigation.navigate('RestoranDetail',{
      onBack
    });
  }

  if(isLoading){ 
    return(
    <Container>
      {renderHeader()}
      <Content>
        <Spinner/>
      </Content>
    </Container>
  ); }
  const _render = (
    <Container>
      {renderHeader()}
      <Content style={{flex:1}}>
        <Button style={{margin:10}} primary onPress={addRestoran}>
          <Text>Add Restoran</Text>
        </Button>
        <FlatList
          style={{margin:10}}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={restoranData}
          renderItem={_renderItem}
          keyExtractor={item => item._id}
          stickyHeaderIndices={fixedHeader}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </Content>
    </Container>
  )
  return _render;
}
