// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

const {ipcMain} = require('electron')

 var ref = require("ref");
	 var ffi = require("ffi");
	 var path = require('path')
	 var fs = require('fs')
	 var _void = ref.types.void 
	var _voidPtr = ref.refType(_void);

	var ctrlHandle = null;
	var tb = null;
		
	var winax = require('winax');
	var Variant = winax.Variant;

	var libDisp = new winax.Object('TPComServerHost.LibDispatch');
	
	var tpPrint = new winax.Object('TPComServerHost.TPPrint'); 
	var libPrint = null;
	 
ipcMain.on('asynchronous-message', (event, arg) => {

  
  if(arg == 'printbill' || arg == 'preview' )
  {
	 	if(tb == null)
		{
			tb = ffi.Library('dll/tbillonecore.dll', {

					'CreateGeneBillCtrl3': ['int', []],
					'FD':['string',['int', _voidPtr, _voidPtr]]
			})
		}
	  if(ctrlHandle == null)
		{
			ctrlHandle = tb.CreateGeneBillCtrl3();
		}
			
		
		var templatelist = fs.readFileSync('./dll/templatelist.json','utf-8');
		var printcfgjson = fs.readFileSync('./dll/printcfg.json','utf-8');
		var taskdata = fs.readFileSync('./dll/taskdata.json','utf-8');
		var curtemplate = path.join('', __dirname, './dll/template.bof');
		

		
		tb.FD(ctrlHandle, Buffer.from('OpenFile\0', 'utf16le'), Buffer.from(curtemplate + '@@1\0', 'utf16le'));
		
		tb.FD(ctrlHandle, Buffer.from('SetPrintCfgJson\0', 'utf16le'), Buffer.from(printcfgjson + '@@1\0', 'utf16le'));
		
		tb.FD(ctrlHandle, Buffer.from('LoadPrintTaskData\0', 'utf16le'), Buffer.from(taskdata+'\0', 'utf16le'));
		if(arg == 'printbill')
		{
			tb.FD(ctrlHandle, Buffer.from('PrintBill\0', 'utf16le'), Buffer.from('0\0', 'utf16le'));
		}
		else
		{
			tb.FD(ctrlHandle, Buffer.from('PrintPreview\0', 'utf16le'), Buffer.from('0@@'+ templatelist+'\0', 'utf16le'));
		}
		
		
		event.sender.send('asynchronous-reply', arg	+': finished');
  }
  else
  // com invoke 
  {
	  console.log(arg);
	  //var vHandle = new Variant(21, 'pint32');
	  //libDisp.CreateLib("mylib", "myfun", vHandle);
	  //console.log("createlib:" + vHandle);
	 // var vrefRet = new Variant('abc', 'pstring');
	 // libDisp.Test("hello",vrefRet);
	 
	 //var b1 = new Variant('b1', 'pstring');
	// var b2 = new Variant('b2', 'pstring');
	 //var b3 = new Variant('b3', 'pstring');
	 //var b4 = new Variant(111, 'pvariant');
	 //var b4 = libDisp.Test3(b1, b2, b3);
	 // console.log("invoke:" + b1 + ',' + b2 + ',' + b3 + ',' + b4);
	 
	 if(libPrint == null)
	 {
		 console.log('create ctrl');
		 libPrint = tpPrint.LoadLib();
		 var vRet = tpPrint.CreateGeneBillCtrl3();
		 console.log('CreateGeneBillCtrl3:' + vRet);
	  }
	 
		var templatelist = fs.readFileSync('./dll/templatelist.json','utf-8');
		var printcfgjson = fs.readFileSync('./dll/printcfg.json','utf-8');
		var taskdata = fs.readFileSync('./dll/taskdata.json','utf-8');
		var curtemplate = path.join('', __dirname, './dll/template.bof');
		

		
		tpPrint.FD('OpenFile', curtemplate + '@@1');
		
		tpPrint.FD('SetPrintCfgJson', printcfgjson + '@@1');
		
		tpPrint.FD('LoadPrintTaskData', taskdata);
		
		if(arg == 'printbill_com')
		{
			tpPrint.FD('PrintBill', 0);
		}
		else
		{
			tpPrint.FD('PrintPreview', '0@@'+ templatelist);
		}
	 
  }
})



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
