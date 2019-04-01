if (__DEV__) {
  import('./Components/Debugging/ReactotronConfig').then(() => console.log("Reactotron Configured"));
}
import {
  createDrawerNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';
import Home from './Components/Pages/Home';
import Wilayah from './Components/Pages/Wilayah';
import WilayahDetail from './Components/Detail/WilayahDetail';
import Harga from './Components/Pages/Harga';
import HargaDetail from './Components/Detail/HargaDetail';
import Restoran from './Components/Pages/Restoran';
import RestoranDetail from './Components/Detail/RestoranDetail';
import SideMenu from './SideMenu';

const DrawerStack = createDrawerNavigator({
  Home: {
    screen: Home
  },
  Wilayah:{screen:Wilayah},
  Restoran:{screen:Restoran},
  Harga:{screen:Harga}
}, {
  contentComponent: SideMenu
});

const StackNavigator = createStackNavigator({
  DrawerStack: {
    screen: DrawerStack
  },
  WilayahDetail:{screen:WilayahDetail},
  RestoranDetail: {
    screen: RestoranDetail
  },
  HargaDetail:{screen:HargaDetail}
}, {
  headerMode: 'none'
});


const AppNavigator = createSwitchNavigator({
  RootStack: StackNavigator
}, {
  initialRouteName: "RootStack"
});
const App = createAppContainer(AppNavigator);
export default App;