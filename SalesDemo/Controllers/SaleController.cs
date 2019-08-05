using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesDemo.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesDemo.Controllers
{
    public class SaleViewModel
    {
        public IEnumerable<Sale> Sales { get; set; }
        public IEnumerable<Customer> Customers { get; set; }
        public IEnumerable<Product> Products { get; set; }
        public IEnumerable<Store> Stores { get; set; }
    }

    [Route("api/[controller]")]
    public class SaleController : Controller
    {


        private readonly ApplicationDbContext _context;
        public SaleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<SaleViewModel>> Get()
        {
            var sales = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .ToListAsync();
            var customers = await _context.Customers.ToListAsync();
            var products = await _context.Products.ToListAsync();
            var stores = await _context.Stores.ToListAsync();

            if (sales.Count == 0)
            {
                sales.Add(new Sale());
            }

            var viewModel = new SaleViewModel()
            {
                Sales = sales,
                Customers = customers,
                Products = products,
                Stores = stores
            };


            return viewModel;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Sale>> Get(int id)
        {
            var sale = await _context.Sales
                .Where(s => s.Id == id)
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .SingleOrDefaultAsync();
            if (sale == null)
            {
                return NotFound();
            }
            return sale;
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<ActionResult<Sale>> Post([FromBody]Sale sale)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();
            _context.Entry(sale).Reference(s => s.Customer).Load();
            _context.Entry(sale).Reference(s => s.Product).Load();
            _context.Entry(sale).Reference(s => s.Store).Load();
            return CreatedAtAction(nameof(Sale), sale);
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Sale>> Put(int id, [FromBody]Sale Sale)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var saleInDb = await _context.Sales.Where(c => c.Id == id).SingleOrDefaultAsync();
            if (saleInDb == null)
            {
                return NotFound();
            }

            saleInDb.Customer = Sale.Customer;
            saleInDb.Product = Sale.Product;
            saleInDb.DateSold = Sale.DateSold;
            saleInDb.Store = Sale.Store;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Sale>> Delete(int id)
        {
            var sale = await _context.Sales.Where(c => c.Id == id).SingleOrDefaultAsync();
            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
