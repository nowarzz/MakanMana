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
import mHarga from '../Model/Harga';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import Reactotron from 'reactotron-react-native';
const mWil = new mHarga();
export default function Harga(props){

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNext,setIsLoadingNext] = useState(false);
  const [HargaData, setHargaData] = useState([{
    _id: "Kode Harga",
    namaHarga: "Nama Harga",
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
      _id: "Kode Harga",
      namaHarga: "Nama Harga",
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
        var docHeader = HargaData.filter(el => el.isHeader);
        var newData = docHeader.concat(resp.data);
        setHargaData(newData);
        setIsEnd(resp.isEnd);
      }else{
        setHargaData(wilayaData.filter(el=>el.isHeader));
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
        var newData = HargaData.concat(resp.data);
        setHargaData(newData);
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

  const bukaDetail = (kodeHarga)=>{
    props.navigation.navigate('HargaDetail',{
      kodeHarga,
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
              data={item.namaHarga}
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
              data={item.namaHarga}
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
          <Title>Harga</Title>
        </Body>
        <Right />
      </Header>
    )    
  }

  const addHarga = ()=>{
    props.navigation.navigate('HargaDetail',{
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
        <Button style={{margin:10}} primary onPress={addHarga}>
          <Text>Add Harga</Text>
        </Button>
        <FlatList
          style={{margin:10}}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={HargaData}
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
