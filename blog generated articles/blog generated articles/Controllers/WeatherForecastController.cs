using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace blog_generated_articles.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        public class set_md {

            public string txt { set; get; }
            public string name { set; get; }

        }

        /// <summary>
        /// 存储dm文件到服务器目录
        /// </summary>
        /// <param name="fc">文本内容</param>
        /// <param name="name">文件名称/BOKE名称</param>
        /// <returns></returns>
        [HttpPost, Route("set/md")]
        public async Task<IActionResult> MD_IF(set_md options)
        {
            try
            {
                System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
                byte[] retVal = md5.ComputeHash(System.Text.Encoding.Default.GetBytes(options.txt));

                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < retVal.Length; i++)
                {
                    sb.Append(retVal[i].ToString("x2"));
                }
                string mad5 = sb.ToString();
                await _Delete(mad5);
                Task<_IO.IActionResult.Strat> task = DirectoryFileStore.FileStore(options.txt, options.name);

                if (task.Result.code == "0")
                    return Ok(task.Result);
                else
                    return NotFound();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
          
        }

     
        [HttpGet, Route("get/md")] 
        public object GetMD()
        {
            try
            {
                string Rootpath = Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\.WebCache";
                Windows_Gis.fileList = new List<Windows_Gis.File>();
                Windows_Gis.GetMultiFile(Rootpath);
                var list = Windows_Gis.fileList;

                var arr = new List<Windows_Gis.File>();
                foreach (var item in list)
                {
                    if (Path.GetDirectoryName(item.path) == Rootpath) {
                        arr.Add(item);                    
                    }
                }
                    
                return (new
                {
                    fileList = arr
                });
            }
            catch (Exception ex)
            {
                return (new
                {
                    messerr = ex.Message
                });
            }

        }


        [HttpPost, Route("blog/post")]
        public object blog_post(string id,bool blogs_state = false)
        {
            try
            {
                string Rootpath = Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\.WebCache";
                Windows_Gis.fileList = new List<Windows_Gis.File>();
                Windows_Gis.GetMultiFile(Rootpath);
                var list = Windows_Gis.fileList;

                var arr = new List<Windows_Gis.File>();
                foreach (var item in list)
                {
                    if (Path.GetDirectoryName(item.path) == Rootpath && item.id == id)
                    {
                        arr.Add(item);
                    }
                }

                #region 去重

                foreach (var item in arr)
                {
                    var mad5 = Windows_Gis.MD5(item.path);
                    _ = _Blogs_Delete(mad5,true);
                }
                   

                #endregion




                var obj = new List<object>();
                var _bool = false;
                foreach (var item in arr)
                {

                    var state = _IO.moveFiles(item.path, Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\BOKE\blogs\source\_posts\" + Path.GetFileName(item.path));
                    obj.Add(new
                    {
                        id = item.id,
                        name = item.name,
                        state = state
                    });
                    if (state) _bool = !_bool;
                }
                string volume = Path.GetDirectoryName(typeof(Program).Assembly.Location).Substring(0, Path.GetDirectoryName(typeof(Program).Assembly.Location).IndexOf(':'));
                if (_bool && blogs_state)
                    _IO.writeBATFile(new string[] {
                        "cd " + Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\BOKE\blogs"
                        ,
                        volume + ":"
                        ,
                        "hexo clean"
                         ,
                        " hexo generate"
                    });
                return (new
                {
                    data = obj
                });
            }
            catch (Exception ex)
            {
                return (new
                {
                    messerr = ex.Message
                });
            }

        }


         [HttpDelete, Route("get/md/delete")]
        public async Task<IActionResult> _Delete(string id)
        {
            string basePath = Path.GetDirectoryName(typeof(Program).Assembly.Location);
            string fileFolder = Path.Combine(basePath, ".WebCache");
            Task<_IO.IActionResult.Strat> task = DirectoryFileStore.FileDelete(id, fileFolder);
            if (task.Result.code == "0")
                return Ok(task.Result);
            else
                return NotFound();
        }


        [HttpPost, Route("get/md/text")]
        public async Task<IActionResult> GetMDtext(String id)
        {
            string Rootpath = Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\.WebCache";
            Windows_Gis.fileList = new List<Windows_Gis.File>();
            Windows_Gis.GetMultiFile(Rootpath);
            var list = Windows_Gis.fileList;
            foreach (var item in list)
            {
                if (item.id == id)
                {
                    Task<_IO.IActionResult.Strat> task = DirectoryFileStore.GetStore(item.path);
                    if (task.Result.code == "0")
                        return Ok(task.Result);
                    else
                        return NotFound();
                }
            }

            return NotFound();


        }


        //BOKE\blogs\source\_posts
        [HttpGet, Route("get/blogs/md")]
        public object GetBlogsMD()
        {
            try
            {

                string Rootpath = Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\BOKE\blogs\source\_posts";
                Windows_Gis.fileList = new List<Windows_Gis.File>();
                Windows_Gis.GetMultiFile(Rootpath);
                var list = Windows_Gis.fileList;
                var arr = new List<Windows_Gis.File>();
                foreach (var item in list)
                {
                    if (Path.GetDirectoryName(item.path) == Rootpath)
                    {
                        arr.Add(item);
                    }
                }

                return (new
                {
                    fileList=arr
                });
            }
            catch (Exception ex)
            {
                return (new
                {
                    messerr = ex.Message
                });
            }

        }
        [HttpDelete, Route("get/blogs/md/delete")]
        public async Task<IActionResult> _Blogs_Delete(string id ,bool state = false)
        {
            string basePath = Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\BOKE\blogs\source\_posts";
            Task<_IO.IActionResult.Strat> task = DirectoryFileStore.FileDelete(id, basePath);
            if (task.Result.code == "0")

                try
                {
                    string volume = Path.GetDirectoryName(typeof(Program).Assembly.Location).Substring(0, Path.GetDirectoryName(typeof(Program).Assembly.Location).IndexOf(':'));
                   if(!state) _IO.writeBATFile(new string[] {
                        "cd " + Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\BOKE\blogs"
                        ,
                        volume + ":"
                        ,
                        "hexo clean"
                         ,
                        "hexo generate"
                    });
                    return Ok(task.Result);
                }
                catch (Exception)
                {
                    return NotFound();
                }
           
            else
                return NotFound();
        }

        

        [HttpPost, Route("get/blogs/md/text")]
        public async Task<IActionResult> GetBlogsMDtext(String id)
        {
            string Rootpath = Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\BOKE\blogs\source\_posts";
            Windows_Gis.fileList = new List<Windows_Gis.File>();
            Windows_Gis.GetMultiFile(Rootpath);
            var list = Windows_Gis.fileList;
            foreach (var item in list)
            {
                if (item.id == id)
                {
                    Task<_IO.IActionResult.Strat> task = DirectoryFileStore.GetStore(item.path);
                    if (task.Result.code == "0")
                        return Ok(task.Result);
                    else
                        return NotFound();
                }
            }
            return NotFound();
        }

        [HttpGet("get/blogs/md/text/{id}")]
        public IActionResult GetFile(string id)
        {
            string basePath = Path.GetDirectoryName(typeof(Program).Assembly.Location) + @"\BOKE\blogs\source\_posts";

            Windows_Gis.fileList = new List<Windows_Gis.File>();
            Windows_Gis.GetMultiFile(basePath);
            var list = Windows_Gis.fileList;
            foreach (var item in list)
            {
                if (item.id == id)
                {
                    var filepath = item.path;

                    var provider = new FileExtensionContentTypeProvider();
                    FileInfo fileInfo = new FileInfo(filepath);
                    var ext = fileInfo.Extension;
                    new FileExtensionContentTypeProvider().Mappings.TryGetValue(ext, out var contenttype);
                    return File(System.IO.File.ReadAllBytes(filepath), contenttype ?? "application/octet-stream", fileInfo.Name);

                }
            }
            return NotFound();
        }


        public static class DirectoryFileStore
        {

            public static async Task<_IO.IActionResult.Strat> FileStore(String text,String name)
            {
                var basePath = Path.GetDirectoryName(typeof(Program).Assembly.Location);
                string fileFolder = Path.Combine(basePath, ".WebCache");

                if (!Directory.Exists(fileFolder))
                    Directory.CreateDirectory(fileFolder);

                _IO.IActionResult.Strat iio = new _IO.IActionResult.Strat();
                var data = new _IO.IActionResult.data
                {
                    count = text.Length,
                    size = 0
                };

                try
                {
                    byte[] array = System.Text.Encoding.UTF8.GetBytes(text);
                    MemoryStream streams = new MemoryStream(array);//convert stream 2 string      
                    var item = streams;
                    if (item.Length > 0)
                    {
                        data.size = item.Length;

                        var fileName = $"{name + ".md"}";//DateTime.Now.ToString("yyyyMMddHHmmss") + 
                        var filePath = Path.Combine(fileFolder, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await item.CopyToAsync(stream);
                        }
                    }

                }
                catch (Exception ex)
                {
                    iio.code = "1";
                    iio.msg = ex.Message;
                }
                iio.data = data;
                return iio;
            }
            public static async Task<_IO.IActionResult.Strat> FileDelete(string id,string fileFolder)
            {
               

                if (!Directory.Exists(fileFolder))
                    Directory.CreateDirectory(fileFolder);
                _IO.IActionResult.Strat iio = new _IO.IActionResult.Strat();
                DirectoryInfo root = new DirectoryInfo(fileFolder);
                int i = 1;

                iio.data = new
                {
                    count = 0
                };

                foreach (FileInfo f in root.GetFiles())
                {
                    if (Windows_Gis.MD5(f.FullName) == id)
                    {
                        try
                        {
                            System.IO.File.Delete(f.FullName);//删除指定文件
                            iio.data = new
                            {
                                count = i++,
                                id
                            };
                        }
                        catch (Exception ex)
                        {
                            iio.code = "1";
                            iio.msg = ex.Message;
                            iio.data = new
                            {
                                count = 0,
                                id
                            };
                            return iio;
                        }
                    }
                }
                return iio;
            }

            public static int GetFileSize(string path)
            {
                FileInfo fileInfo;
                try
                {
                    fileInfo = new FileInfo(path);
                }
                catch
                {
                    return 0;
                }
                if (fileInfo != null && fileInfo.Exists)
                {
                    return (int)System.Math.Ceiling(fileInfo.Length / 1024.0);
                }
                else
                {
                    return 0;
                }
            }
            public static async Task<_IO.IActionResult.Strat> GetStore(String path)
            {
             
                _IO.IActionResult.Strat iio = new _IO.IActionResult.Strat();
                string subtitle = "";
                string title = "";
                string txt = "";
                try
                {
                    #region 读取文本文件
                    using (StreamReader sr = new StreamReader(path))
                    {
                        string line;
                        title = sr.ReadLine();

                        while ((line = sr.ReadLine()) != null)
                        {
                            txt += line;
                        }

                        // 从文件读取并显示行，直到文件的末尾 
                        while ((line = sr.ReadLine()) != null)
                        {
                            if (subtitle != "") {
                                subtitle = line;
                                break;
                            }
                            subtitle = " ";
                        }
                    }
                   
                    #endregion

                }
                catch (Exception ex)
                {
                    iio.code = "1";
                    iio.msg = ex.Message;
                }

                var data = new _IO.IActionResult.data
                {
                    title = title,
                    subtitle = subtitle,
                    count = txt.Length,
                    size = GetFileSize(path),
                    name = Path.GetFileNameWithoutExtension(path)
                };

                FileInfo fi = new FileInfo(path);
                var time = fi.LastWriteTime;

                //获取当前Ticks
                long currentTicks = time.Ticks;
                DateTime dtFrom = new DateTime(1970, 1, 1, 0, 0, 0, 0);
                long currentMillis = (currentTicks - dtFrom.Ticks/*- dtFrom.Ticks*/) / 10000;

                iio.time = currentMillis;
                iio.data = data;
                return iio;
            }


        }
    }
    public class _IO
    {
        // copy all file(*.md) in folder src to dest
        public static bool moveFiles(string srcFolder, string destFolder)
        {
            string src = srcFolder;
            string dest = destFolder;
            FileInfo fi1 = new FileInfo(src);
            FileInfo fi2 = new FileInfo(dest);

            try
            {
                // Create the source file.
                // using (FileStream fs = fi1.Create()) { }
           
                if (File.Exists(dest))
                {
                    fi2.Delete();
                }
                //Copy the file.f
                fi1.CopyTo(dest);

                //Ensure that the target file does not exist.
                if (File.Exists(src))
                {
                    fi1.Delete();
                }
               
                return true;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
        /// <summary>
        /// 运行CMD命令
        /// </summary>
        /// <param name="cmd">命令</param>
        /// <returns></returns>
        public static void RunCmd(string[] cmd)
        {
            Process p = new Process();
            try
            {
                var txt = "";
                foreach (var item in cmd)
                {
                    txt += item + "&&";
                }

                //设置要启动的应用程序
                p.StartInfo.FileName = "cmd.exe";
                //是否使用操作系统shell启动
                p.StartInfo.UseShellExecute = false;
                // 接受来自调用程序的输入信息
                p.StartInfo.RedirectStandardInput = true;
                //输出信息
                p.StartInfo.RedirectStandardOutput = true;
                // 输出错误
                p.StartInfo.RedirectStandardError = true;
                //不显示程序窗口
                p.StartInfo.CreateNoWindow = true;
                //启动程序
                p.Start();

                //向cmd窗口发送输入信息
                p.StandardInput.WriteLine(txt + "exit");

                p.StandardInput.AutoFlush = true;

                //获取输出信息
                string strOuput = p.StandardOutput.ReadToEnd();
                //等待程序执行完退出进程
                p.WaitForExit();

                Console.WriteLine(txt);
                Console.WriteLine(strOuput);
                p.Close();
                p.Dispose();
            }
            catch (Exception)
            {
                p.Close();
                throw;
            }
           
            
        }
        public static void writeBATFile(string[] cmd)
        {

            var txt = "@echo off";
            txt += "\r\necho cd exe_path\r\nstart cmd /k \"";
            foreach (var item in cmd)
            {
                txt += item + "&&";
            }
            txt += "exit\"";
            //txt += "\r\npause";

            string basePath = Path.GetDirectoryName(typeof(Program).Assembly.Location);
            string filePath = Path.Combine(basePath, ".ExeCache");
            string path = filePath + "\\daban.bat";



            if (Directory.Exists(filePath) == false)//如果不存在就创建file文件夹
            {
                Directory.CreateDirectory(filePath);
            }
            if (!File.Exists(filePath))
            {
                FileStream fs1 = new FileStream(path, FileMode.Create, FileAccess.Write);//创建写入文件
                StreamWriter sw = new StreamWriter(fs1, Encoding.Default);
                sw.WriteLine(txt);//开始写入值
                sw.Close();
                fs1.Close();
            }
            else
            {
                FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Write);
                StreamWriter sr = new StreamWriter(fs,Encoding.Default);
                sr.WriteLine(txt);//开始写入值
                sr.Close();
                fs.Close();
            }
            try
            {

                //using (Process myPro = new Process())
                //{
                //    myPro.StartInfo.FileName = Path.Combine(filePath, path);
                //    myPro.StartInfo.UseShellExecute = false;
                //    myPro.StartInfo.CreateNoWindow = true;
                //    myPro.Start();
                //    myPro.WaitForExit();
                //}
                {
                    //System.Diagnostics.ProcessStartInfo psi = new System.Diagnostics.ProcessStartInfo();
                    //psi.FileName = path;
                    //psi.UseShellExecute = false;
                    //psi.CreateNoWindow = true;
                    //System.Diagnostics.Process.Start(psi);
                }
                {

                    ProcessStartInfo processInfo = new ProcessStartInfo(path);
                    processInfo.UseShellExecute = false;
                    processInfo.CreateNoWindow = true;
                    Process batchProcess = new Process();
                    batchProcess.StartInfo = processInfo;
                    batchProcess.Start();
                }
                //if (File.Exists(path))
                //{
                //    File.Delete(path);
                //}

            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception Occurred :{0},{1}", ex.Message, ex.StackTrace.ToString());
                throw;
            }


        }


     
    public class IActionResult
            {
                public class Strat
                {
           
                    public string code { get; set; } = "0";
                    public object data { get; set; }
                    public string msg { get; set; } = "success";
                    public long time { get; set; }
                }
                public class data
                {
                    public string title { get; set; }
                    public string subtitle { get; set; }
                    public int count { get; set; }
                    public long size { get; set; }
                    public string name { get; set; }
                }
            }
        }

        public class Windows_Gis
        {
            /// <summary>
            /// 获取文件MD5值
            /// </summary>
            /// <param name="fileName">文件绝对路径</param>
            /// <returns>MD5值</returns>
            public static string MD5(string fileName)
            {
                try
                {
                    FileStream file = new FileStream(fileName, FileMode.Open, FileAccess.ReadWrite, FileShare.ReadWrite);
                    System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
                    byte[] retVal = md5.ComputeHash(file);
                    file.Close();

                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < retVal.Length; i++)
                    {
                        sb.Append(retVal[i].ToString("x2"));
                    }
                    return sb.ToString();
                }
                catch (Exception ex)
                {
                    throw new Exception("MD5() fail,error:" + ex.Message);
                }
            }
            #region 查找目录下包含子目录的全部文件


            public static List<File> fileList = new List<File>();

            public class File
            {
                public string id { get; set; }
                public string path { get; set; }
                public string name { get; set; }
                public string txt { get; set; }
                public long time { get; set; }

            }
            public static bool GetMultiFile(string path)
            {
                if (Directory.Exists(path) == false)
                { return false; }
            

                DirectoryInfo dirs = new DirectoryInfo(path); //获得程序所在路径的目录对象
                DirectoryInfo[] dir = dirs.GetDirectories();//获得目录下文件夹对象
                FileInfo[] file = dirs.GetFiles();//获得目录下文件对象
                int dircount = dir.Count();//获得文件夹对象数量
                int filecount = file.Count();//获得文件对象数量
                int sumcount = dircount + filecount;

                if (sumcount == 0)
                { return false; }

                //循环文件夹
                for (int j = 0; j < dircount; j++)
                {
                    string pathNodeB = path + "\\" + dir[j].Name;
                    GetMultiFile(pathNodeB);
                }

                //循环文件
                for (int j = 0; j < filecount; j++)
                {
               
                    if (Path.GetExtension(file[j].FullName) == ".md") {

                        var txt = "";
                        #region 读取文本文件
                        using (StreamReader sr = new StreamReader(file[j].FullName))
                        {
                            txt = sr.ReadLine();
                        }

                        FileInfo fi = new FileInfo(file[j].FullName);
                        var time = fi.LastWriteTime;

                        //获取当前Ticks
                        long currentTicks = time.Ticks;
                        DateTime dtFrom = new DateTime(1970, 1, 1, 0, 0, 0, 0);
                        long currentMillis = (currentTicks - dtFrom.Ticks/*- dtFrom.Ticks*/) / 10000;

                        #endregion
                        fileList.Add(new File
                        {
                            name = Path.GetFileName(file[j].FullName),
                            path = file[j].FullName,
                            id = MD5(file[j].FullName),
                            txt = txt,
                            time = currentMillis
                        });
                    }
               
                }
                return true;
            }

            #endregion

        }

    }
