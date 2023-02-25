package com.bit.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.bit.model.BbsDao;
import com.bit.model.BbsDto;

@WebServlet("/bbs/*")
public class DetailController extends HttpServlet {
	Logger log = Logger.getLogger(this.getClass().getCanonicalName());
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json; charset=UTF-8");
		BbsDto bbs = new BbsDto();
		String[] uris = req.getRequestURI().split("/");
		String[] ends = uris[uris.length-1].split(":");
		int bbsno = Integer.parseInt(ends[ends.length-1]);
		
		try(PrintWriter out = resp.getWriter();) {
			
			BbsDao dao = new BbsDao();
			bbs = dao.getOne(bbsno);
			out.print("{\"bbs\":{");
			out.print("\"num\":" + bbs.getNum()
					+ ", \"title\":\""+bbs.getTitle()+"\""
					+ ", \"author\":\""+bbs.getAuthor()+"\""
					+ ", \"writeDate\":\""+bbs.getWriteDate().toLocalDate()+"\""
					+ ", \"content\":\""+bbs.getContent()+"\""
					+ ", \"viewcnt\":"+bbs.getViewcnt());
			out.print("}}");
		} catch (NamingException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}	
	}
}
