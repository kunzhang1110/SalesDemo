using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesDemo.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesDemo.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> Get()
        {
            var products = await _context.Products.ToListAsync();
            if (products.Count == 0)
            {
                products.Add(new Product());
            }
            return products;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> Get(int id)
        {
            var product = await _context.Products.Where(c => c.Id == id).SingleOrDefaultAsync();
            if (product == null)
            {
                return NotFound();
            }
            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Product>> Post([FromBody]Product Product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _context.Products.Add(Product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Product), Product);

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> Put(int id, [FromBody]Product Product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var ProductInDb = await _context.Products.Where(c => c.Id == id).SingleOrDefaultAsync();
            if (ProductInDb == null)
            {
                return NotFound();
            }

            ProductInDb.Name = Product.Name;
            ProductInDb.Price = Product.Price;
            ProductInDb.Sale = Product.Sale;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> Delete(int id)
        {
            var Product = await _context.Products.Where(c => c.Id == id).SingleOrDefaultAsync();
            _context.Products.Remove(Product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
